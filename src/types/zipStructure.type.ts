import { JsonIndex } from './jsonIndexStructure.type'
import { SeatData } from './jsonSeatStructure.type'

export interface ZipStructure {
    index: JsonIndex
    seats: Record<string, SeatData>
    images: Record<string, Blob>
}