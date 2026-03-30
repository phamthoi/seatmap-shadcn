import { SeatItemConfig, JsonIndex, SeatData } from '@/types'

export function getDataSeatConfig(
  index: JsonIndex,
  seats?: Record<string, SeatData>,
  images?: Record<string, Blob>
): SeatItemConfig[] {
    const seatColorMap: Record<string, string> = {}
    const allSeatFiles = Object.values(seats ?? {});

    allSeatFiles.forEach((fileContent) => {
        fileContent?.categories?.forEach((cat: any) => {
            if (cat.id && cat.available?.style?.color) {
                seatColorMap[cat.id] = cat.available.style.color
            }
        })
    })

    return index.layout.flatMap((zone) =>
        zone.categories.map((category) => {
            const rawImage = images?.[category.product.image]
            const image = rawImage instanceof Blob
                ? URL.createObjectURL(rawImage)
                : rawImage ?? ''

            return {
                id: category.id,
                name: category.product.name,
                quota: category.product.quota,
                price: category.product.price,
                color: seatColorMap[category.id] ?? zone.style.color,
                image,
            }
        })
    )
}