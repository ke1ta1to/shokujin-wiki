import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import * as path from "path";

interface ShokujinWikiAppStackProps extends cdk.StackProps {
  environment: "Production" | "Staging" | "Development";
  createLambda: boolean;
}

export class ShokujinWikiAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ShokujinWikiAppStackProps) {
    super(scope, id, props);

    const isProduction = props.environment === "Production";

    const uploadBucket = new s3.Bucket(this, "ResourceBucket", {
      bucketName: `shokujin-wiki-uploads-${props.environment.toLocaleLowerCase()}-${this.account}`,
      removalPolicy: isProduction
        ? cdk.RemovalPolicy.RETAIN
        : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProduction,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.POST],
          allowedOrigins: ["*"],
        },
      ],
    });

    if (props.environment === "Development") {
      const uploadUser = new iam.User(this, "UploadUser", {
        userName: `shokujin-wiki-upload-${props.environment.toLocaleLowerCase()}`,
      });

      uploadUser.addToPolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["s3:PutObject"],
          resources: [uploadBucket.arnForObjects("uploads/*")],
        }),
      );

      const accessKey = new iam.AccessKey(this, "UploadUserAccessKey", {
        user: uploadUser,
      });

      new secretsmanager.Secret(this, "UploadUserSecret", {
        secretObjectValue: {
          accessKeyId: cdk.SecretValue.resourceAttribute(accessKey.accessKeyId),
          secretAccessKey: accessKey.secretAccessKey,
          userName: cdk.SecretValue.unsafePlainText(uploadUser.userName),
        },
      });
    }

    let defaultBehavior: cloudfront.BehaviorOptions;
    if (props.createLambda) {
      const originVerifySecret = new secretsmanager.Secret(
        this,
        "OriginVerifySecret",
        {
          secretName: `shokujin-wiki-origin-verify-${props.environment}`,
          generateSecretString: {
            secretStringTemplate: JSON.stringify({}), // 空オブジェクトをベース
            generateStringKey: "token", // "token" というキーでランダム文字列を生成
            excludePunctuation: true,
            passwordLength: 32,
          },
        },
      );

      const lambdaFunction = new lambda.DockerImageFunction(
        this,
        "ShokujinWikiFunction",
        {
          code: lambda.DockerImageCode.fromImageAsset(
            path.join(__dirname, "../../../"),
            {
              file: "packages/web/Dockerfile",
              platform: cdk.aws_ecr_assets.Platform.LINUX_ARM64,
              exclude: [
                "**/node_modules",
                "packages/infra",
                ".git",
                "**/.next",
              ],
            },
          ),
          memorySize: 1024,
          timeout: cdk.Duration.minutes(1),
          architecture: lambda.Architecture.ARM_64,
          environment: {
            AWS_S3_BUCKET_NAME: uploadBucket.bucketName,
          },
        },
      );
      // S3バケットへのアクセス権を付与
      uploadBucket.grantReadWrite(lambdaFunction);

      lambdaFunction.addEnvironment(
        "ORIGIN_VERIFY_SECRET",
        cdk.SecretValue.secretsManager(originVerifySecret.secretArn, {
          jsonField: "token",
        }).unsafeUnwrap(),
      );
      const db = secretsmanager.Secret.fromSecretNameV2(
        this,
        "DatabaseSecret",
        `shokujin-wiki/${props.environment.toLocaleLowerCase()}/database`,
      );
      lambdaFunction.addEnvironment(
        "DATABASE_URL",
        cdk.SecretValue.secretsManager(db.secretArn, {
          jsonField: "DATABASE_URL",
        }).unsafeUnwrap(),
      );
      lambdaFunction.addEnvironment(
        "DIRECT_URL",
        cdk.SecretValue.secretsManager(db.secretArn, {
          jsonField: "DIRECT_URL",
        }).unsafeUnwrap(),
      );

      const lambdaFunctionUrl = lambdaFunction.addFunctionUrl({
        authType: lambda.FunctionUrlAuthType.NONE,
      });

      defaultBehavior = {
        origin: new cloudfront_origins.FunctionUrlOrigin(lambdaFunctionUrl, {
          customHeaders: {
            "x-origin-verify": cdk.SecretValue.secretsManager(
              originVerifySecret.secretArn,
              { jsonField: "token" },
            ).unsafeUnwrap(),
          },
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        originRequestPolicy:
          cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        functionAssociations: [
          {
            // hostヘッダをx-forwarded-hostにコピー
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            function: new cloudfront.Function(this, "ViewerRequestFunction", {
              code: cloudfront.FunctionCode.fromInline(`
                function handler(event) {
                  var request = event.request;
                  request.headers['x-forwarded-host'] = request.headers.host;
                  return request;
                }
              `),
            }),
          },
        ],
      };
    } else {
      defaultBehavior = {
        origin: new cloudfront_origins.HttpOrigin("example.com"),
        functionAssociations: [
          {
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            function: new cloudfront.Function(
              this,
              "DummyViewerRequestFunction",
              {
                code: cloudfront.FunctionCode.fromInline(`
                  function handler(event) {
                    return {
                      statusCode: 403,
                    };
                  }
            `),
              },
            ),
          },
        ],
      };
    }

    const distribution = new cloudfront.Distribution(
      this,
      "ResourceDistribution",
      {
        defaultBehavior,
      },
    );
    distribution.addBehavior(
      "/uploads/*",
      cloudfront_origins.S3BucketOrigin.withOriginAccessControl(uploadBucket),
      {
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    );

    new cdk.CfnOutput(this, "UploadBucketName", {
      value: uploadBucket.bucketName,
    });
    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
    });
  }
}
