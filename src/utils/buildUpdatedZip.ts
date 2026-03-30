import { ZipStructure, JsonIndex, SeatItemConfig, SeatData, SeatCategory } from '@/types'

export function buildUpdatedZip(
  original: ZipStructure,
  headerName: string,
  items: SeatItemConfig[],
  newImageBlobs: Record<string, Blob>,
): ZipStructure {
  const itemMap = new Map(items.map((i) => [i.id, i]))
  const updatedIndex: JsonIndex = {
    ...original.index,
    name: headerName,
    layout: original.index.layout.map((layoutItem) => ({
      ...layoutItem,
      style: (() => {
        const firstMatchedItem = layoutItem.categories
          .map((cat) => itemMap.get(cat.id))
          .find(Boolean)
        return firstMatchedItem
          ? { ...layoutItem.style, color: firstMatchedItem.color }
          : layoutItem.style
      })(),
      categories: layoutItem.categories.map((cat) => {
        const item = itemMap.get(cat.id)
        if (!item) return cat

        const imageFileName = item.imageFileName ?? cat.product.image

        return {
          ...cat,
          product: {
            ...cat.product,
            name: item.name,
            price: item.price,
            image: newImageBlobs[item.id] ? imageFileName : cat.product.image,
            
          },
        }
      }),
    })),
  }

  const updatedSeats: Record<string, SeatData> = Object.fromEntries(
    Object.entries(original.seats).map(([fileName, seatData]) => {
      const updatedCategories: SeatCategory[] = seatData.categories.map((seatCat) => {
        const item = itemMap.get(seatCat.id)
        if (!item) return seatCat

        const applyColor = (state: SeatCategory[keyof SeatCategory]) => {
          if (typeof state !== 'object' || !state) return state
          return {
            ...state,
            style: {
              ...state.style,
              color: item.color,
            },
          }
        }

        return {
          ...seatCat,
          available: applyColor(seatCat.available) as SeatCategory['available'],
          reserved: applyColor(seatCat.reserved) as SeatCategory['reserved'],
          blocked: applyColor(seatCat.blocked) as SeatCategory['blocked'],
          selected: applyColor(seatCat.selected) as SeatCategory['selected'],
        }
      })

      return [fileName, { ...seatData, categories: updatedCategories }]
    }),
  )

  const updatedImages = { ...original.images }

  for (const [itemId, blob] of Object.entries(newImageBlobs)) {
    const imageFileName = `${itemId}.png`
    updatedImages[imageFileName] = blob
  }

  for (const item of items) {
    if (!item.image) {
      const imageFileName = `${item.id}.png`
      delete updatedImages[imageFileName]
    }
  }

  return {
    index: updatedIndex,
    seats: updatedSeats,
    images: updatedImages,
  }
}