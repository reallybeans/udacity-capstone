/**
 * Fields in a request to update a single gear item.
 */
export interface UpdateGearRequest {
  name: string
  dueDate: string
  done: boolean
}