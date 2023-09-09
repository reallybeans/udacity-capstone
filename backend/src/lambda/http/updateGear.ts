import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateGear } from '../../businessLogic/gears'
import { UpdateGearRequest } from '../../requests/UpdateGearRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const gearId = event.pathParameters.gearId
    const updatedGear: UpdateGearRequest = JSON.parse(event.body)
    // gear: Update a gear item with the provided id using values in the "updatedGear" object
    const userId = getUserId(event)
    await updateGear(userId, gearId, updatedGear)

    return { statusCode: 204, body: '' }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
