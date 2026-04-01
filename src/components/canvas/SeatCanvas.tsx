import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { SeatCanvasProps } from '@/types'

export function SeatCanvas({
  size,
  seats,
  seatOffset = [0, 0],
  seatRadius = 6,
  availableColor = '#1976d2',
  categoryColorMap = {},
  backgroundImage,
  bgPosition,
  position,
  scale,
  isDragging,
  hoveredSeatId,
  onMouseDown,
  onSeatMouseEnter,
  onSeatMouseLeave,
  onSeatClick,
  className,
}: SeatCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, height] = size

  return (
    <div
      onMouseDown={onMouseDown}
      className={cn(
        'absolute inset-0 overflow-hidden select-none',
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
        className,
      )}
    >
      {/* Pan + zoom transform layer */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex flex-col items-center justify-center origin-center"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      >
        {/* "Hướng sân" label — chỉ hiện khi không có ảnh nền */}
        {!backgroundImage && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-primary text-primary-foreground px-6 py-1 rounded-md">
              <p className="text-xs font-semibold">HƯỚNG SÂN</p>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-w-full max-h-full"
        >
          {/* Background image */}
          {backgroundImage && bgPosition && (
            <image
              href={backgroundImage}
              x={bgPosition.x}
              y={bgPosition.y}
              width={bgPosition.width}
              height={bgPosition.height}
              preserveAspectRatio="xMidYMid slice"
            />
          )}

          {/* Seats */}
          {seats.map((seat) => {
            const x = (seat.p?.[0] ?? 0) + seatOffset[0]
            const y = (seat.p?.[1] ?? 0) + seatOffset[1]
            const r = seat.p?.[2] ?? seatRadius
            const isHovered = hoveredSeatId === seat.id

            const categoryKey =
              seat.category
            const fill =
              (categoryKey && categoryColorMap[categoryKey]) ?? availableColor

            return (
              <g key={seat.id ?? `${x}-${y}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={fill}
                  stroke={isHovered ? '#ffffff' : 'none'}
                  strokeWidth={isHovered ? 3 : 0}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => onSeatMouseEnter(seat, e)}
                  onMouseLeave={onSeatMouseLeave}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSeatClick?.(seat.id)
                  }}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={Math.max(8, r * 0.6)}
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {seat.name ?? seat.col ?? ''}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}