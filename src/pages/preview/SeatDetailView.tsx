import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

import { ZoomControls } from '@/components/zoom'
import { SeatCanvas } from '@/components/canvas'
import { SeatInfo } from '@/components/info'
import { ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from '@/constants'
import { SeatDetailViewProps, Seat } from '@/types'

export function SeatDetailView({
  indexData,
  seatData,
  imageMap = {},   // ← map filename → object URL, truyền từ PreviewPage
  onBack,
  className,
}: SeatDetailViewProps) {

  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

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
      setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
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

  const handleSeatMouseEnter = useCallback(
    (seat: Seat, e: React.MouseEvent<SVGCircleElement>) => {
      setHoveredSeat(seat)
      const rect = e.currentTarget.getBoundingClientRect()
      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 10 })
    },
    [],
  )

  const handleSeatMouseLeave = useCallback(() => setHoveredSeat(null), [])

  // Tính seatRadius từ categories nếu có, fallback về 6
  const seatRadius = (() => {
    const firstCat = seatData?.categories?.[0]
    const sizeVal = firstCat?.available?.size?.[0]
    return sizeVal ? sizeVal / 2 : 6
  })()

  const backgroundImage = useMemo<string | undefined>(() => {
    const rawKey = seatData?.annotations?.style?.backgroundImage
    if (!rawKey) return undefined

    // Exact match trước
    if (imageMap[rawKey]) return imageMap[rawKey]

    const basename = rawKey.split('/').pop() ?? rawKey
    const matchedKey = Object.keys(imageMap).find(
      (k) => k === basename || k.endsWith('/' + basename) || k.endsWith('\\' + basename)
    )
    return matchedKey ? imageMap[matchedKey] : undefined
  }, [seatData?.annotations?.style?.backgroundImage, imageMap])

  console.log("backgroundImage", backgroundImage)

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader className="shrink-0 border-b pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{indexData?.name ?? ''}</CardTitle>
          {/* Nút back — chỉ hiển thị ở multi-zone khi onBack được truyền vào */}
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative flex-1 p-0 overflow-hidden" style={{ height: 750 }}>
        <ZoomControls
          scale={scale}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          className="absolute left-4 top-4 z-10"
        />

        <SeatCanvas
          size={seatData.size}
          seats={seatData.seats}
          seatOffset={seatData.offset}       // ← SeatData dùng "offset", không phải "seatOffset"
          seatRadius={seatRadius}
          availableColor={seatData.categories?.[0]?.available?.style?.color}
          categoryColorMap={
            Object.fromEntries(
              (seatData.categories ?? []).map((cat) => [
                cat.id,
                cat.available?.style?.color ?? '#cccccc',
              ])
            )
          }
          backgroundImage={backgroundImage}
          bgPosition={
            seatData.annotations?.position
              ? {
                  x: seatData.annotations.position.x,
                  y: seatData.annotations.position.y,
                  width: seatData.annotations.position.width,
                  height: seatData.annotations.position.height,
                }
              : undefined
          }
          position={position}
          scale={scale}
          isDragging={isDragging}
          hoveredSeatId={hoveredSeat?.id ?? null}
          onMouseDown={handleMouseDown}
          onSeatMouseEnter={handleSeatMouseEnter}
          onSeatMouseLeave={handleSeatMouseLeave}
        />

        <SeatInfo seat={hoveredSeat} x={tooltipPos.x} y={tooltipPos.y} />
      </CardContent>
    </Card>
  )
}