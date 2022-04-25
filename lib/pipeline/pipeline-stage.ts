import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BlogCdkCognitoStack } from '../blog-cdk-cognito-stack';

export class PipelineStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        new BlogCdkCognitoStack(this, 'DevStack');
    }
}
