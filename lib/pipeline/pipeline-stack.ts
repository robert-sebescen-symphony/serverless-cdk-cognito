import * as cdk from "aws-cdk-lib";
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { PipelineStage } from "./pipeline-stage";

export class MyPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Pipeline code goes here
    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "MyPipeline",
      synth: new CodeBuildStep("SynthStep", {
        input: CodePipelineSource.connection(
          "robert-sebescen-symphony/serverless-cdk-cognito",
          "pipeline",
          {
            connectionArn:
              "arn:aws:codestar-connections:us-east-1:251539944380:connection/712a43a3-478c-446b-8210-eac759dd3893",
          }
        ),
        installCommands: ["npm install -g aws-cdk"],
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    const deploy = new PipelineStage(this, "Deploy");
    const deployStage = pipeline.addStage(deploy);
  }
}
