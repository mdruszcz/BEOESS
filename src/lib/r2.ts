import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

export const R2_BUCKET = process.env.R2_BUCKET_NAME ?? "study-library";
const PUBLIC_HOST = process.env.NEXT_PUBLIC_R2_PUBLIC_HOST;

// Lazily created so the app can boot (e.g. for the public catalogue)
// even if R2 isn't configured yet.
let _client: S3Client | null = null;

export function r2(): S3Client {
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Cloudflare R2 is not configured. Set R2_ENDPOINT, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY."
    );
  }
  if (!_client) {
    _client = new S3Client({
      region: "auto",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return _client;
}

/** Presigned PUT URL so the browser uploads the file straight to R2. */
export async function createUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  // URL valid for 10 minutes.
  return getSignedUrl(r2(), command, { expiresIn: 600 });
}

/** Public read URL for an object stored in the bucket. */
export function publicUrl(key: string): string {
  if (!PUBLIC_HOST) return "#";
  return `https://${PUBLIC_HOST}/${key}`;
}
