import { APIGatewayProxyWithCognitoAuthorizerHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const documentClient = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyWithCognitoAuthorizerHandler = async (
  event
) => {
  const { email } = event.requestContext.authorizer.claims;
  const date =
    event.queryStringParameters &&
    new Date(event.queryStringParameters.date as string);

  var params: DynamoDB.DocumentClient.QueryInput = {
    TableName: "attendanceTable",
    KeyConditionExpression:
      "#dateKey = :dateValue AND #emailKey = :emailValue",
    ExpressionAttributeNames: { "#dateKey": "Date", "#emailKey": "Email" },
    ExpressionAttributeValues: {
      ":dateValue": date?.toDateString(),
      ":emailValue": email,
    },
  };
  const results = await documentClient.query(params).promise();
  console.log(results.$response);
  console.log(results.Items);
  return {
    statusCode: 200,
    body: JSON.stringify(results.Items),
  };
};
