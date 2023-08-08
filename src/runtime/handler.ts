import { defineEventHandler, getQuery, readMultipartFormData } from 'h3'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { HttpError } from './error';

export default defineEventHandler(async (event) => {
  const awsRegion = process.env.AWS_REGION
  const awsBucket = process.env.AWS_BUCKET
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

  if (!awsSecretAccessKey || !awsAccessKeyId) {
    return new HttpError().UNAUTHORIZED
  }

  const client = new S3Client({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  const method = event.node.req.method;
  const query = getQuery(event);

  switch (method) {
    case 'PUT':
      try {
        const formData = await readMultipartFormData(event)
        const file = formData?.find((i) => i.name === 'file')
        const fileName = formData?.find((i) => i.name === 'filename')?.data.toString('utf8')

        if (!file) {
          return new HttpError(["Cannot find item \"file\" in payload!"]).BAD_DATA
        }

        const commandParams = {
          Bucket: awsBucket,
          Key: fileName || file?.filename,
          Body: file?.data,
          ACL: query.public ? 'public-read' : 'private'
        }

        await client.send(new PutObjectCommand(commandParams));

        const fullUrl = `https://${awsBucket}.s3.${awsRegion}.amazonaws.com/${commandParams.Key}`

        return { success: true, fullUrl };
      } catch {
        return new HttpError().INTERNAL_SERVER_ERROR
      }
    default:
      return new HttpError().METHOD_NOT_ALLOWED
  }
})
