import { apiEndpoint } from '../config'
import { Gear } from '../types/Gear'
import { CreateGearRequest } from '../types/CreateGearRequest'
import Axios from 'axios'
import { UpdateGearRequest } from '../types/UpdateGearRequest'

export async function getGears(idToken: string): Promise<Gear[]> {
  console.log('Fetching gears')

  const response = await Axios.get(`${apiEndpoint}/gears`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('gears:', response.data)
  return response.data.items
}

export async function createGear(
  idToken: string,
  newGear: CreateGearRequest
): Promise<Gear> {
  const response = await Axios.post(
    `${apiEndpoint}/gears`,
    JSON.stringify(newGear),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function patchGear(
  idToken: string,
  gearId: string,
  updatedGear: UpdateGearRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/gears/${gearId}`,
    JSON.stringify(updatedGear),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteGear(
  idToken: string,
  gearId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/gears/${gearId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  gearId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/gears/${gearId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
