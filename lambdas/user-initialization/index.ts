import { Context, APIGatewayProxyResultV2, APIGatewayEvent } from 'aws-lambda';
import { SendCommandCommand, SSMClient } from '@aws-sdk/client-ssm';
import { CreateKeyPairCommand, EC2Client } from '@aws-sdk/client-ec2';

export const userInitHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResultV2> => {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
    if (event.body === null) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Incorrect Payload',
            })
        }   
    }
    const ec2Client = new EC2Client({});
    const ssmClient = new SSMClient({});
    const bodyObject = JSON.parse(event.body);
    if (bodyObject.username === undefined ) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Incorrect Payload',
            })
        }   
    }
    const command = await ec2Client.send(new CreateKeyPairCommand({KeyName: bodyObject.username + "-aws-key"}));
    if (command !== undefined && command.KeyMaterial !== undefined) {
        await ssmClient.send(new SendCommandCommand({DocumentName: "InfrastructureStack-EC2SSHinituser-NrqDit63S3eq", InstanceIds:['i-07f4c881dfbafe89c'], Parameters: {action: ["initialize"], user: [bodyObject.username], privateKey:[JSON.stringify(command.KeyMaterial)] }}));
        return {
            statusCode: 200,
            body: command.KeyMaterial
        }   
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Command broke.',
            })
        }   
    }
};