import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from '@/constants'
import { Canvas } from '@/components/canvas'
import { ZoomControls } from '@/components/zoom'
import { Zone } from '@/components/info'
import { PolygonItem, ZoneInfo, StadiumPreviewProps, LayoutItem, CategoryProduct } from '@/types'
import { formatVnd, toSvgPoints } from '@/utils'

export function StadiumPreview({
  indexData,
  onZoneClick,
  onCategoryColorsExtracted,
  imageMap = {},
  isSingleZone = false,
  className,
}: StadiumPreviewProps) {
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const [items, setItems] = useState<CategoryProduct[]>([])

  const size: [number, number] = indexData?.size ?? [1000, 800]

  const backgroundImage: string | undefined = useMemo(() => {
    if (!indexData?.style?.image) return undefined
    const imgKey = indexData.style.image

    if (imageMap[imgKey]) return imageMap[imgKey]

    const basename = imgKey.split('/').pop() ?? imgKey
    const matchedKey = Object.keys(imageMap).find(
      (k) => k === basename || k.endsWith('/' + basename) || k.endsWith('\\' + basename)
    )
    return matchedKey ? imageMap[matchedKey] : undefined
  }, [indexData?.style?.image, imageMap])

  const handleZoomIn = () => setScale((s) => Math.min(s * ZOOM_STEP, ZOOM_MAX))
  const handleZoomOut = () => setScale((s) => Math.max(s / ZOOM_STEP, ZOOM_MIN))
  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      })
    },
    [isDragging],
  )

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (!isDragging) return
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const polygons = useMemo<PolygonItem[]>(() => {
    // FIX 2: Tách điều kiện rõ ràng — chỉ skip khi isSingleZone=true
    if (isSingleZone) {
      onCategoryColorsExtracted?.({})
      return []
    }

    // FIX 3: Guard đầy đủ trước khi dùng layout
    if (!indexData || !Array.isArray(indexData.layout) || indexData.layout.length === 0) {
      console.warn('[StadiumPreview] indexData.layout is empty or not an array:', indexData?.layout)
      onCategoryColorsExtracted?.({})
      return []
    }

    const colorMap: Record<string, string> = {}
    const activeOpacity = backgroundImage ? 0.4 : 0.8
    const idleOpacity = backgroundImage ? 0 : 0.5

    const result = (indexData.layout as LayoutItem[])
      .filter((z) => {
        const valid = Array.isArray(z.points) && z.points.length >= 6
        if (!valid) {
          console.warn(`[StadiumPreview] Zone "${z.id}" bị bỏ qua — points không hợp lệ:`, z.points)
        }
        return valid
      })
      .map<PolygonItem>((zone) => {
        const color = zone.style?.color ?? '#cccccc'
        colorMap[zone.id] = color

        return {
          id: zone.id,
          points: toSvgPoints(zone.points!),
          fill: color,
          stroke: backgroundImage ? 'transparent' : color,
          opacity: hoveredZoneId === zone.id ? activeOpacity : idleOpacity,
          onClick: (e) => {
            e.stopPropagation()
            onZoneClick?.(zone.id)
          },
          onMouseEnter: (e) => {
            setHoveredZoneId(zone.id)
            const rect = (e.target as SVGPolygonElement).getBoundingClientRect()
            setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 10 })
          },
          onMouseLeave: () => setHoveredZoneId(null),
        }
      })

    onCategoryColorsExtracted?.(colorMap)
    return result
  }, [indexData, isSingleZone, hoveredZoneId, backgroundImage, onZoneClick, onCategoryColorsExtracted])

  const tooltipInfo = useMemo<ZoneInfo | null>(() => {
    if (!hoveredZoneId) return null
    const item = items.find((i) => i.name === hoveredZoneId)
    if (!item) return null
    return { name: item.name, price: formatVnd(item.price) }
  }, [hoveredZoneId, items])

  const isDataReady = !!indexData && Array.isArray(indexData.layout) && indexData.layout.length > 0

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader className="shrink-0 border-b pb-3">
        <CardTitle className="text-base">
          {indexData?.name ?? 'Đang tải...'}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative flex-1 p-0 overflow-hidden">
        <ZoomControls
          scale={scale}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          className="absolute left-4 top-4 z-10"
        />

        {!isDataReady && !isSingleZone && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm z-10 pointer-events-none">
            Không có dữ liệu layout để hiển thị
          </div>
        )}

        <Canvas
          size={size}
          backgroundImage={backgroundImage}
          polygons={polygons}
          position={position}
          scale={scale}
          isDragging={isDragging}
          onMouseDown={handleMouseDown}
        />

        <Zone
          zoneName={hoveredZoneId}
          x={tooltipPos.x}
          y={tooltipPos.y}
          info={tooltipInfo}
        />
      </CardContent>
    </Card>
  )
}