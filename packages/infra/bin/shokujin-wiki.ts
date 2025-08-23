#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ShokujinWikiAppStack } from "../lib/shokujin-wiki-app-stack";

const app = new cdk.App();

const environment =
  (app.node.tryGetContext("environment") as string) || "development";

const envConfig = app.node.tryGetContext(environment);

console.log(JSON.stringify({ environment, envConfig }, null, 2));

new ShokujinWikiAppStack(app, `ShokujinWikiAppStack${envConfig.environment}`, {
  environment: envConfig.environment,
  createLambda: envConfig.createLambda,
});
