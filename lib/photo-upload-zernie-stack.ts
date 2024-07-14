import * as cdk from "aws-cdk-lib";
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { PipelineStage } from "./PipelineStage";

export class PhotoUploadZernieStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "s3-pipeline", {
      pipelineName: "s3-pipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub(
          "Popo422/photo-upload-s3",
          "main"
        ),
        commands: ["npm ci", "npx cdk synth"],
      }),
    });

    const testStage = pipeline.addStage(
      new PipelineStage(this, "PipelineStageDev", {
        stageName: "dev",
      })
    );

    testStage.addPre(
      new CodeBuildStep("unit-tests", {
        commands: ["npm ci", "npm test"],
      })
    );
  }
}
