import { Stack, StackProps, Stage } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface LambdaStackProps extends StackProps {
  stageName?: string;
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
      },
    });

    this.photoUploadLambdaIntegration = new LambdaIntegration(photUploadLambda);
  }
}
