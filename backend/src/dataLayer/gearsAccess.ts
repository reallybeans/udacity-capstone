// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { GearItem } from '../models/GearItem'
import { GearUpdate } from '../models/GearUpdate'
import { UpdateGearRequest } from '../requests/UpdateGearRequest'
var AWSXRay = require('aws-xray-sdk')
var AWS = require('aws-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('GearsAccess')

// gear: Implement the dataLayer logic
export class GearsAccess {
  constructor(
    private readonly doc_client: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly gears_table = process.env.gearS_TABLE,
    private readonly gears_index = process.env.INDEX_NAME
  ) {}

  async getAllGears(userId: string): Promise<GearItem[]> {
    logger.info('Start all gears function')
    const result = await this.doc_client
      .query({
        TableName: this.gears_table,
        IndexName: this.gears_index,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items
    return items as GearItem[]
  }

  async createGearItem(gearItem: GearItem): Promise<GearItem> {
    logger.info('Start create gear')

    const result = await this.doc_client
      .put({ TableName: this.gears_table, Item: gearItem })
      .promise()

    logger.info('Gear created', result)
    return gearItem as GearItem
  }

  async updateGearItem(
    gearId: string,
    userId: string,
    gearUpdate: UpdateGearRequest
  ): Promise<GearUpdate> {
    logger.info('Start update item function')
    const updatedGear = await this.doc_client
      .update({
        TableName: this.gears_table,
        Key: {
          gearId,
          userId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
          ':name': gearUpdate.name,
          ':dueDate': gearUpdate.dueDate,
          ':done': gearUpdate.done
        },
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()
    return updatedGear.Attributes as GearUpdate
  }

  async deleteGearItem(gearId: string, userId: string): Promise<string> {
    logger.info('Start delete item')

    const deleteItem = await this.doc_client
      .delete({
        TableName: this.gears_table,
        Key: {
          gearId,
          userId
        }
      })
      .promise()
    logger.info('item deleted: ', deleteItem)
    return gearId
  }

  async updateGearAttachmentUrl(
    gearId: string,
    userId: string,
    attachmentUrl: string
  ): Promise<void> {
    logger.info('Start update attachment url')

    await this.doc_client
      .update({
        TableName: this.gears_table,
        Key: {
          gearId,
          userId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
      .promise()
  }
}
