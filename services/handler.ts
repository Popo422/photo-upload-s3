const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const s3Client = new S3Client();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    const { path, httpMethod, body }: APIGatewayProxyEvent = event;
    if (path === "/upload" && httpMethod === "POST" && body !== null) {
      // Handle upload logic
      const { name, image, contentType } = JSON.parse(body);
      const arn = process.env.PHOTO_BUCKET_ARN;
      const parts = arn ? arn.split(":") : [];
      const bucketName = parts[parts.length - 1];
      const params = {
        Bucket: bucketName,
        Key: `${uuidv4()}-${name}`,
        Body: Buffer.from(image, "base64"),
        ContentType: contentType,
      };
      const command = new PutObjectCommand(params);
      const result = await s3Client.send(command);
      const response: APIGatewayProxyResult = {
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
          "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 200,
        body: JSON.stringify({
          url: `${bucketName}.s3.ap-northeast-1.amazonaws.com/${params.Key}`,
          
        }),
      };

      return response;
    } else if (path === "/upload" && httpMethod === "GET" && body !== null) {
      // Handle download logi
      const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: "peep poop",
      };

      return response;
    }

    const err: APIGatewayProxyResult = {
      statusCode: 500,
      body: "body is empty",
    };
    return err;
  } catch (error: any) {
    console.log(error);
    const err: APIGatewayProxyResult = {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
    return err;
  }
}

export { handler };
