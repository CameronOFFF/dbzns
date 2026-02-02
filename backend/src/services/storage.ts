export interface UploadResult {
  url: string;
  key: string;
}

export async function uploadAvatar(file: Buffer, filename: string): Promise<UploadResult> {
  if (process.env.S3_ENDPOINT && process.env.S3_BUCKET) {
    return {
      url: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${filename}`,
      key: filename,
    };
  }

  return { url: `/uploads/${filename}`, key: filename };
}
