import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// gear: Implement the fileStogare logic
const s3BucketName = process.env.ATTACHMENT_S3_BUCKET
const url_exp = 300

export class AttachmentUtils {
  constructor(
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = s3BucketName
  ) {}

  getAttachmentUrl(gearId: string) {
    return `https://${this.bucketName}.s3.amazonaws.com/${gearId}`
  }

  getUploadUrl(gearId: string): string {
    console.log('calling getUploadUrl', this.bucketName)
    const url = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: gearId,
      Expires: url_exp
    })
    console.log('url', url)
    return url as string
  }
}
