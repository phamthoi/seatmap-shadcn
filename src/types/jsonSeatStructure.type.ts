export interface SeatStyle {
    color: string
    image: string
}

export interface SeatState {
    size: [number, number]
    style: SeatStyle
}

export interface SeatCategory{
    id: string
    available: SeatState
    reserved: SeatState
    blocked: SeatState
    selected: SeatState
}

export interface Seat {
    p: [number, number, number]
    id: string
    name: string
    category: string
    row: string
    col: string
}

export interface AnnotationPosition {
    x: number
    y: number
    width: number
    height: number
    type: string
    z: number
}

export interface Annotation {
    id: string
    type: string
    style: {
        backgroundImage: string
    }
    position: AnnotationPosition
}

export interface SeatData {
    zoneId: string
    categories: SeatCategory[]
    seats: Seat[]
    size: [number, number]
    offset: [number, number]
    annotations: Annotation
}
