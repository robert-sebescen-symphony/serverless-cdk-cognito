import { Stack } from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { CLIENT_URL } from "./config";

export function cognitoSetup(stack: Stack) {
  const userPool = new cognito.UserPool(stack, "employeeUserPool", {
    userPoolName: "emoloyee-userpool",
    selfSignUpEnabled: true
  });

  const userPoolClient = userPool.addClient("attendanceApp", {
    oAuth: {
      callbackUrls: [CLIENT_URL],
      scopes: [cognito.OAuthScope.EMAIL],
    },
  });

  const cognitoDomain = new cognito.UserPoolDomain(stack, "attendanceLogin", {
    cognitoDomain: {
      domainPrefix: "attendance-demo-123",
    },
    userPool: userPool,
  });

  return {
    userPool,
    userPoolClient,
  };
}
