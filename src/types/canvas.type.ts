import { Seat } from './jsonSeatStructure.type'

export interface PolygonItem {
    id: string
    points: string
    fill: string
    stroke: string
    opacity: number
    onClick: (e: React.MouseEvent<SVGPolygonElement>) => void
    onMouseEnter: (e: React.MouseEvent<SVGPolygonElement>) => void
    onMouseLeave: () => void
}

export interface CanvasProps {
    size:[number, number]
    backgroundImage?: string
    polygons: PolygonItem[]
    position: {x: number, y: number}
    scale: number
    isDragging: boolean
    onMouseDown: (e: React.MouseEvent) => void
    className?: string
}

export interface SeatCanvasProps {
  size: [number, number]
  seats: Seat[]
  seatOffset?: [number, number]
  seatRadius?: number
  availableColor?: string
  categoryColorMap?: Record<string, string>
  backgroundImage?: string
  bgPosition?: { x: number; y: number; width: number; height: number }
  /** Pan offset */
  position: { x: number; y: number }
  scale: number
  isDragging: boolean
  hoveredSeatId: string | null
  onMouseDown: (e: React.MouseEvent) => void
  onSeatMouseEnter: (seat: Seat, e: React.MouseEvent<SVGCircleElement>) => void
  onSeatMouseLeave: () => void
  onSeatClick?: (seatId: string) => void
  className?: string
}