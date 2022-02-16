import { Stack } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export function dynamoDbSetup(stack: Stack) {
  return new dynamodb.Table(stack, "AttendanceTable", {
    partitionKey: {
      name: "Date",
      type: dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: "Email",
      type: dynamodb.AttributeType.STRING,
    },
    tableName: "attendanceTable",
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });
}