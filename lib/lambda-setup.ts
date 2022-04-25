import { Stack } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";

export function createLambda(stack: Stack, handler: string, tableName: string) {
    return new lambda.Function(stack, handler, {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("functions"),
      handler: `${handler}.handler`,
      environment: {
        TABLE_NAME: tableName,
      }
    });
  }