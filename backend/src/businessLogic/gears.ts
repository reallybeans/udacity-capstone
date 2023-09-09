import { GearsAccess } from '../dataLayer/gearsAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { GearItem } from '../models/GearItem'
import { GearUpdate } from '../models/GearUpdate'
import { CreateGearRequest } from '../requests/CreateGearRequest'
import { UpdateGearRequest } from '../requests/UpdateGearRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// gear: Implement businessLogic
const logger = createLogger('GearsAccesss')
const attachmentUtils = new AttachmentUtils()
const gearsAccess = new GearsAccess()

// Get gear function
export async function getGearsForUser(userId: string) {
  logger.info('Get gears user with params', userId)
  return gearsAccess.getAllGears(userId)
}

// Create gear function
export async function createGear(
  new_gear: CreateGearRequest,
  userId: string
): Promise<GearItem> {
  logger.info('Start create gear function')

  const gearId = uuid.v4()
  const createdAt = new Date().toISOString()
  const s3_attachment_url = attachmentUtils.getAttachmentUrl(gearId)
  const new_item = {
    userId,
    gearId,
    createdAt,
    done: false,
    attachmentUrl: s3_attachment_url,
    ...new_gear
  }
  return await gearsAccess.createGearItem(new_item)
}

// Update gear function
export async function updateGear(
  userId: string,
  gearId: string,
  gearUpdate: UpdateGearRequest
): Promise<GearUpdate> {
  logger.info('Start update gear function')
  return gearsAccess.updateGearItem(gearId, userId, gearUpdate)
}

// Delete gear function
export async function deleteGear(
  userId: string,
  gearId: string
): Promise<string> {
  logger.info('Start detele gear function')
  return gearsAccess.deleteGearItem(gearId, userId)
}

// create url img of gear function
export async function createAttachmentPresignedUrl(
  gearId: string,
  userId: string
): Promise<string> {
  logger.info(
    `Start create Attachment Presigned Url gear function: ${userId} & ${gearId}`
  )
  const url = attachmentUtils.getUploadUrl(gearId)
  return url as string
}
