#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { Codebuild } from "../lib/codebuild";
import { Hosting } from "../lib/hosting";

const env = { region: "us-east-1" };
const app = new cdk.App();
new Codebuild(app, `BooksAdminCodebuild`, {
  env,
});
new Hosting(app, `BooksAdminHosting`, {
  env,
});
