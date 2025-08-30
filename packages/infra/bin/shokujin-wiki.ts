#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import z from "zod";
import { ShokujinWikiStack } from "../lib/shokujin-wiki-stack";

const app = new cdk.App();

const environmentSchema = z.enum(["development", "production"]);
const environment = app.node.tryGetContext("environment");
if (!environmentSchema.safeParse(environment).success) {
  throw new Error(
    'Invalid environment. Please specify "-c environment=development" or "-c environment=production".',
  );
}

new ShokujinWikiStack(app, `ShokujinWikiStack${capitalize(environment)}`, {
  environment,
});

function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
