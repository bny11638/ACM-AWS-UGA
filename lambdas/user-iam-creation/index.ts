import { Context, APIGatewayProxyResultV2, APIGatewayEvent } from 'aws-lambda';
import * as iam from '@aws-sdk/client-iam';
import { IAMClient } from '@aws-sdk/client-iam';

export const userIAMHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResultV2> => {
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
    const bodyObject = JSON.parse(event.body);
    if (bodyObject.username === undefined || bodyObject.password === undefined) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Incorrect Payload',
            })
        }   
    }
    const iamClient = new IAMClient({region: 'us-east-1'});
    const createUserCommand = new iam.CreateUserCommand({UserName: bodyObject.username});
    const request = await iamClient.send(createUserCommand);
    if (request.$metadata.httpStatusCode === 200) {
        const loginProfileRequest = await iamClient.send(new iam.CreateLoginProfileCommand({UserName: bodyObject.username, Password: bodyObject.password}));
        if (loginProfileRequest.$metadata.httpStatusCode === 200) {
            return {
                statusCode: loginProfileRequest.$metadata.httpStatusCode,
                body: JSON.stringify({
                    Username: bodyObject.username,
                    Password: bodyObject.password
                })
            }
        } else {
            return {
                statusCode: loginProfileRequest.$metadata.httpStatusCode,
                body: JSON.stringify({
                    message: 'IAM Login Profile creation failed.',
                })
            }  
        }
    } else {
        return {
            statusCode: request.$metadata.httpStatusCode,
            body: JSON.stringify({
                message: 'IAM Account creation failed',
            })
        }  
    }
};