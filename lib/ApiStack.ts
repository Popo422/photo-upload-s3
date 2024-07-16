import { Stack, StackProps } from "aws-cdk-lib";
import {
  Cors,
  LambdaIntegration,
  ResourceOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  photoUploadLambdaIntegration: LambdaIntegration;
}
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    const api = new RestApi(this, "photoUpload");
    //declare a resource endpont eg: /spaces
    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
    };
    const uploadResources = api.root.addResource("upload", optionsWithCors);
    // create a method where its get but its like this /spaces/{spaceId}
    // spacesResources.addResource("{spaceId}");
    uploadResources.addMethod("GET", props.photoUploadLambdaIntegration);
    uploadResources.addMethod("POST", props.photoUploadLambdaIntegration);
  }
}
