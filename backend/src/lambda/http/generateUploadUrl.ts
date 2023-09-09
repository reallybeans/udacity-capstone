import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/gears'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const gearId = event.pathParameters.gearId
    // gear: Return a presigned URL to upload a file for a gear item with the provided id
    const userId = getUserId(event)
    const url = await createAttachmentPresignedUrl(gearId, userId)

    return { statusCode: 201, body: JSON.stringify({ uploadUrl: url }) }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
