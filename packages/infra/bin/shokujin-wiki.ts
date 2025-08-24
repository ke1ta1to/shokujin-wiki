#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import z from "zod";
import { ShokujinWikiAppStack } from "../lib/shokujin-wiki-app-stack";
import { ShokujinWikiStack } from "../lib/shokujin-wiki-stack";

const app = new cdk.App();

const mode = app.node.tryGetContext("mode") || "app";

if (mode === "app") {
  const environmentSchema = z.enum(["development", "production"]);
  const environment = app.node.tryGetContext("environment");
  if (!environmentSchema.safeParse(environment).success) {
    throw new Error(
      'Invalid environment. Please specify "-c environment=development" or "-c environment=production".',
    );
  }

  new ShokujinWikiAppStack(
    app,
    `ShokujinWikiAppStack${capitalize(environment)}`,
    { environment },
  );
} else if (mode === "default") {
  new ShokujinWikiStack(app, "ShokujinWikiStack");
}

function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
