import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Role, ServicePrincipal, PolicyStatement, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { aws_ssm as ssm } from 'aws-cdk-lib';
import { ec2UserInitDocument } from './util/ssmDocuments';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // Create SSM Document to initialize the new ssh users in the EC2 instance
    const cfnDocument = new ssm.CfnDocument(this, 'EC2-SSH-init-user', {
      content: ec2UserInitDocument,
      documentType: 'Command'
    });
    // 👇 create VPC in which we'll launch the Instance
    const vpc = new ec2.Vpc(this, 'my-cdk-vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      subnetConfiguration: [
        {name: 'public', cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC},
      ],
    });

    // 👇 create Security Group for the Instance
    const webserverSG = new ec2.SecurityGroup(this, 'webserver-sg', {
      vpc,
      allowAllOutbound: true,
    });
    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'allow SSH access from anywhere',
    );
    // 👇 create a Role for the EC2 Instance
    const webserverRole = new Role(this, 'webserver-role', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMFullAccess')],
    });
    // 👇 create the EC2 Instance
    const acmEc2Ssh = new ec2.Instance(this, 'ec2-ssh-server', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      role: webserverRole,
      securityGroup: webserverSG,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      })
    });
    // The code that defines your stack goes here
    const userAuthFunction = new lambda.Function(this, 'user-initalization', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.userInitHandler',
      code: lambda.Code.fromAsset("../build-artifacts/lambdas/user-initialization/")
    });
    const ec2AcmSshPolicy = new PolicyStatement({
      actions: ['ec2:*', 'ssm:*'],
      resources: ["*"]
    })
    userAuthFunction.addToRolePolicy(ec2AcmSshPolicy);
    new LambdaRestApi(this, 'apigateway-user-auth', {
      handler: userAuthFunction
    })
  }
}