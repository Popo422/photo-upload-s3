import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  photoUploadLambdaIntegration: LambdaIntegration;
}
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    const api = new RestApi(this, "photoUpload");
    //declare a resource endpont eg: /spaces
    const spacesResources = api.root.addResource("upload");
// create a method where its get but its like this /spaces/{spaceId}
    // spacesResources.addResource("{spaceId}");
    
    spacesResources.addMethod("GET", props.photoUploadLambdaIntegration);
    spacesResources.addMethod("POST", props.photoUploadLambdaIntegration);
  }
}
