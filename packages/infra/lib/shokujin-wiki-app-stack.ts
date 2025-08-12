import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ShokujinWikiAppStackProps extends cdk.StackProps {}

export class ShokujinWikiAppStack extends cdk.Stack {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(scope: Construct, id: string, props: ShokujinWikiAppStackProps) {
    super(scope, id, props);
  }
}
