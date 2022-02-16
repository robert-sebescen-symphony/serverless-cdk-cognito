import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

import { CLIENT_URL } from "./config";
import { createLambda } from "./lambda-setup";
import { dynamoDbSetup } from "./dynamo-db-setup";
import { cognitoSetup } from "./cognito-setup";
import { MethodOptions } from "aws-cdk-lib/aws-apigateway";

export class BlogCdkCognitoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // lambdas
    const getAttendance = createLambda(this, "getAttendance");
    const addAttendance = createLambda(this, "addAttendance");
    const removeAttendance = createLambda(this, "removeAttendance");

    // db
    const dynamoDb = dynamoDbSetup(this);

    // db access for lambda
    dynamoDb.grantReadData(getAttendance);
    dynamoDb.grantReadWriteData(addAttendance);
    dynamoDb.grantReadWriteData(removeAttendance);


    // api gateway
    const api = new apigateway.RestApi(this, "api", {
      defaultCorsPreflightOptions,
    });
    // Cognito auth wire-up
    const cognito = cognitoSetup(this);
    const apiAuthorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      "employeeAuthorizer",
      {
        cognitoUserPools: [cognito.userPool],
      }
    );
    const apiOptions: MethodOptions = {
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: apiAuthorizer,
    };
    const resource = api.root.addResource("attendance", {
      defaultMethodOptions: apiOptions,
    });

    resource.addMethod("GET", new apigateway.LambdaIntegration(getAttendance));
    resource.addMethod("POST", new apigateway.LambdaIntegration(addAttendance));
    resource.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(removeAttendance)
    );
  }
}

const defaultCorsPreflightOptions = {
  allowHeaders: ["Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key"],
  allowMethods: apigateway.Cors.ALL_METHODS,
  allowCredentials: true,
  allowOrigins: [CLIENT_URL],
};
