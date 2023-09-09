import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteGear } from '../../businessLogic/gears'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const gearId = event.pathParameters.gearId
    // gear: Remove a gear item by id
    const userId = getUserId(event)
    await deleteGear(userId, gearId)
    return { statusCode: 204, body: '' }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
