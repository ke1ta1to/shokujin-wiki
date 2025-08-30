import { S3Client } from "@aws-sdk/client-s3";

export function createClient() {
  return new S3Client({});
}
