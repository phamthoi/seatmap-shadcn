export interface SeatPlanRecord {
  id: string | number
  originalFilename?: string
  name?: string
  createAt?: string
}

export interface Props {
    record: SeatPlanRecord
}