import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // The code that defines your stack goes here
    const userAuthFunction = new lambda.Function(this, 'test', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.userInitHandler',
      code: lambda.Code.fromAsset("../build-artifacts/lambdas")
    });
  }
}