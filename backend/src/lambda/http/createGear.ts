import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateGearRequest } from '../../requests/CreateGearRequest'
import { getUserId } from '../utils'
import { createGear } from '../../businessLogic/gears'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newGear: CreateGearRequest = JSON.parse(event.body)
    // gear: Implement creating a new gear item
    const user_id = getUserId(event)
    const new_item = await createGear(newGear, user_id)
    return { statusCode: 201, body: JSON.stringify({ item: new_item }) }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
