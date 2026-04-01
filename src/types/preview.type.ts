import { JsonIndex } from './jsonIndexStructure.type'
import { SeatData } from './jsonSeatStructure.type'

export interface StadiumPreviewProps {
  indexData: any
  onZoneClick: (zoneName: string) => void
  onCategoryColorsExtracted?: (colors: Record<string, string>) => void
  imageMap?: Record<string, string>
  isSingleZone?: boolean
  className?: string
}

export interface PreviewState {
  zoneSvg: string
  stadiumName: string
  identifier?: string
  imageMap?: Record<string, string>
  uploadedImages?: File[]
  seatFiles?: SeatData[]
  indexData?: JsonIndex
  fromHistory?: boolean
  fromEdit?: boolean
  isConfirmed?: boolean
  fromLocal?: boolean
}

export interface SeatDetailViewProps {
  indexData: JsonIndex
  imageMap?: Record<string, string>
  seatData: SeatData
  onBack?: () => void
  className?: string
}