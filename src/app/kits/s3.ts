import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  region: "auto",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

const bucketName = "memo";

export default async function upload(body: Buffer, path: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      ACL: "public-read",
      Body: body,
      Key: path,
    });
    const data = await client.send(command);
    return "https://img.reading-memo.xyz/" + path;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
