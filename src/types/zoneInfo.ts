import { Seat } from './jsonSeatStructure.type'

export interface ZoneInfo {
  name: string
  price: string  
}
 
export interface ZoneInfoProps {
  zoneName: string | null
  x: number
  y: number
  info?: ZoneInfo | null
}
 
export interface SeatInfoProps {
  seat: Seat | null
  x: number
  y: number
}