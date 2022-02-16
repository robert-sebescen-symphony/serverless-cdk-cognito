import { APIGatewayProxyWithCognitoAuthorizerHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const documentClient = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyWithCognitoAuthorizerHandler = async (
  event
) => {
  const { email } = event.requestContext.authorizer.claims;
  const body = JSON.parse(event.body as string) as { date: string };
  const date = new Date(body.date);

  var params = {
    TableName: "attendanceTable",
    Item: {
      Date: date.toDateString(),
      Email: email,
    },
  };
  await documentClient.put(params).promise();
  return {
    statusCode: 201,
    body: "",
  };
};
