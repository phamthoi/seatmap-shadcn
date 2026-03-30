export interface SeatPlanRecord {
  id: string | number
  name?: string
  createAt?: string
}

export interface SeatPlanProps {
    record: SeatPlanRecord
}