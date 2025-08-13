import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as iam from "aws-cdk-lib/aws-iam";

interface ShokujinWikiResourceStackProps extends cdk.StackProps {
  environment: string;
}

export class ShokujinWikiResourceStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: ShokujinWikiResourceStackProps,
  ) {
    super(scope, id, props);

    const isProduction = props.environment === "production";

    const uploadBucket = new s3.Bucket(this, "ResourceBucket", {
      bucketName: `shokujin-wiki-upload-${props.environment}-${this.account}`,
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

    const distribution = new cloudfront.Distribution(
      this,
      "ResourceDistribution",
      {
        defaultBehavior: {
          origin:
            cloudfront_origins.S3BucketOrigin.withOriginAccessControl(
              uploadBucket,
            ),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    );

    const uploadUser = new iam.User(this, "UploadUser", {
      userName: `shokujin-wiki-upload-${props.environment}`,
    });

    uploadUser.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:PutObject"],
        resources: [uploadBucket.arnForObjects("*")],
      }),
    );

    const accessKey = new iam.AccessKey(this, "UploadUserAccessKey", {
      user: uploadUser,
    });

    new cdk.CfnOutput(this, "UploadBucketName", {
      value: uploadBucket.bucketName,
    });
    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
    });

    new cdk.CfnOutput(this, "UploadAccessKeyId", {
      value: accessKey.accessKeyId,
    });
    new cdk.CfnOutput(this, "UploadSecretAccessKey", {
      value: accessKey.secretAccessKey.unsafeUnwrap(),
    });
  }
}
