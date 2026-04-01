import { SeatInfoProps } from '@/types'

export function SeatInfo({ seat, x, y }: SeatInfoProps) {
  if (!seat) return null
 
  const seatLabel = seat.col ?? seat.name ?? seat.id
 
  return (
    <div
      className="pointer-events-none fixed z-[9999] min-w-[100px] -translate-x-1/2 -translate-y-full rounded-md border bg-popover px-3 py-2 shadow-md text-popover-foreground text-xs"
      style={{ left: x, top: y }}
    >
      <div className="flex justify-between gap-3">
        <span className="text-muted-foreground">Hàng:</span>
        <span className="font-semibold">{seat.row ?? '-'}</span>
      </div>
      <div className="flex justify-between gap-3 mt-0.5">
        <span className="text-muted-foreground">Ghế:</span>
        <span className="font-semibold">{seatLabel}</span>
      </div>
    </div>
  )
}