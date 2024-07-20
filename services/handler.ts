const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
      const putCommand = new PutObjectCommand(params);
      await s3Client.send(putCommand);
      const getCommand = new GetObjectCommand(params);
      const signedUrl = await getSignedUrl(s3Client, getCommand, {
        expiresIn: 7 * 24 * 60 * 60, // 7 days
      });
      const response: APIGatewayProxyResult = {
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 200,
        body: JSON.stringify({
          url: signedUrl,
          fileName: params.Key,
        }),
      };

      return response;
    } else if (path === "/upload" && httpMethod === "GET" && body !== null) {
      // Handle download logi
      const { fileName } = JSON.parse(body);
      const arn = process.env.PHOTO_BUCKET_ARN;
      const parts = arn ? arn.split(":") : [];
      const bucketName = parts[parts.length - 1];
      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });
      const signedUrl = await getSignedUrl(s3Client, getCommand, {
        expiresIn: 7 * 24 * 60 * 60, // 7 days
      });

      const response: APIGatewayProxyResult = {
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 200,
        body: JSON.stringify({
          url: signedUrl,
        }),
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
