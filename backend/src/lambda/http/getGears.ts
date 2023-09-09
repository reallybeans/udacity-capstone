import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getGearsForUser } from '../../businessLogic/gears'
import { getUserId } from '../utils'

// gear: Get all gear items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    const gears = await getGearsForUser(userId)

    return { statusCode: 200, body: JSON.stringify({ items: gears }) }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
