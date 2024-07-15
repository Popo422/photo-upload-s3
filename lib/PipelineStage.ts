import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaStack } from "./LambdaStack";
import { ApiStack } from "./ApiStack";
import { PhotosStack } from "./PhotosStack";

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);
    const photoBucket = new PhotosStack(this, "PhotosStack");
    const photolambda = new LambdaStack(this, "LambdaStack", {
      stageName: props.stageName,
      photoBucketArn: photoBucket.photosBucketArn,
    });
    new ApiStack(this, "photoUploadApiStack", {
      photoUploadLambdaIntegration: photolambda.photoUploadLambdaIntegration,
    });
  }
}
