import { Stack, StackProps, Stage } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { IamResource } from "aws-cdk-lib/aws-appsync";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface LambdaStackProps extends StackProps {
  stageName?: string;
  photoBucketArn?: string;
}
export class LambdaStack extends Stack {
  public readonly photoUploadLambdaIntegration: LambdaIntegration;
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const photUploadLambda = new NodejsFunction(this, "s3-file-upload", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "services", "handler.ts"),
      environment: {
        STAGE: props.stageName!,
        PHOTO_BUCKET_ARN: props.photoBucketArn!,
      },
    });
    photUploadLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [props.photoBucketArn!],
        actions: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      })
    );
    this.photoUploadLambdaIntegration = new LambdaIntegration(photUploadLambda);
  }
}
