#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ShokujinWikiResourceStack } from "../lib/shokujin-wiki-resource-stack";

const app = new cdk.App();
// new ShokujinWikiAppStack(app, "ShokujinWikiStack", {
//   env: {
//     account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION
//   },
// });

// new ShokujinWikiResourceStack(app, "ProductionShokujinWikiResourceStack", {
//   environment: "production"
// });

// new ShokujinWikiResourceStack(app, "StagingShokujinWikiResourceStack", {
//   environment: "staging"
// });

new ShokujinWikiResourceStack(app, "DevelopmentShokujinWikiResourceStack", {
  environment: "development",
});
