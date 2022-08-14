import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const userAuthFunction = new lambda.Function(this, 'user-initalization', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.userInitHandler',
      code: lambda.Code.fromAsset("../build-artifacts/lambdas")
    });
    new LambdaRestApi(this, 'apigateway-user-auth', {
      handler: userAuthFunction
    })
  }
}
