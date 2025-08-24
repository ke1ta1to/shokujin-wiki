import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as iam from "aws-cdk-lib/aws-iam";

export class ShokujinWikiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new iam.User(this, "ShokujinWikiUser", {
      userName: "shokujin-wiki-uploads-user",
    });
  }
}
