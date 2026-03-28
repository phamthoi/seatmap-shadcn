export interface JsonIndex {
    name: string
    identifier: string
    size: [number, number]
    style: {
        color: string 
        image: string
        size: [number, number]
        xy: [number, number]
    }
    layout: LayoutItem[]
    seatPlanType: string
}

export interface LayoutItem {
    id: string 
    ame: string 
    file: string
    points: number[]
    style: { color: string }
    categories: Category[]
}

export interface Category {
    id: string
    product: CategoryProduct
}

export interface CategoryProduct {
    name: string 
    image: string
    gate: string
    seat: boolean
    floor: number
    quota: number
    price: number
}