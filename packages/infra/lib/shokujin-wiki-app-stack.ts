import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";

interface ShokujinWikiAppStackProps extends cdk.StackProps {
  environment: "development" | "production";
}

export class ShokujinWikiAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ShokujinWikiAppStackProps) {
    super(scope, id, props);

    const isProduction = props.environment === "production";

    const uploadsBucket = new s3.Bucket(this, "UploadsBucket", {
      bucketName: `shokujin-wiki-uploads-${props.environment}-${this.account}`,
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
      "UploadsDistribution",
      {
        defaultBehavior: {
          origin:
            cloudfront_origins.S3BucketOrigin.withOriginAccessControl(
              uploadsBucket,
            ),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    );

    new cdk.CfnOutput(this, "UploadsBucketName", {
      value: uploadsBucket.bucketName,
    });

    new cdk.CfnOutput(this, "UploadsDistributionDomainName", {
      value: distribution.domainName,
    });

    const uploadsUser = iam.User.fromUserName(
      this,
      "UploadsUser",
      "shokujin-wiki-uploads-user",
    );

    uploadsBucket.grantWrite(uploadsUser);
  }
}
