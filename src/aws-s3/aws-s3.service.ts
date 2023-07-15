import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const LEGAL_STORAGE_BUCKET = process.env.LEGAL_STORAGE_BUCKET;
if (!LEGAL_STORAGE_BUCKET) {
  throw new Error(`Storage is missing required configuration.`);
}

@Injectable()
export class AwsS3Service {
  getS3Client() {
    //* Make sure secrets are set
    const LEGAL_STORAGE_ACCESS_KEY = process.env.LEGAL_STORAGE_ACCESS_KEY;
    const LEGAL_STORAGE_SECRET = process.env.LEGAL_STORAGE_SECRET;
    const LEGAL_STORAGE_REGION = process.env.LEGAL_STORAGE_REGION;
    const LEGAL_STORAGE_BUCKET = process.env.LEGAL_STORAGE_BUCKET;
    if (
      !(
        LEGAL_STORAGE_ACCESS_KEY &&
        LEGAL_STORAGE_SECRET &&
        LEGAL_STORAGE_REGION &&
        LEGAL_STORAGE_BUCKET
      )
    ) {
      throw new Error(`Storage is missing required configuration.`);
    }

    //* Initialize S3 Client
    const client = new S3Client({
      credentials: {
        accessKeyId: LEGAL_STORAGE_ACCESS_KEY,
        secretAccessKey: LEGAL_STORAGE_SECRET,
      },
      region: LEGAL_STORAGE_REGION,
    });
    return client;
  }

  async getSignedUrl({ fileKey }: { fileKey: string }) {
    //* Make sure secrets are set

    const command = new GetObjectCommand({
      Bucket: `${LEGAL_STORAGE_BUCKET}`,
      Key: fileKey,
    });
    const url = await getSignedUrl(this.getS3Client(), command, {
      expiresIn: 3600,
    });

    return url;
  }

  async deleteDocument({ fileKey }: { fileKey: string }) {
    const command: DeleteObjectCommand = new DeleteObjectCommand({
      Bucket: `${process.env.LEGAL_STORAGE_BUCKET}`,
      Key: fileKey,
    });
    await this.getS3Client().send(command);
  }
}
