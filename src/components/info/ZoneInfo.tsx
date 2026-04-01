import { ZoneInfoProps } from '@/types'

export function Zone({
  zoneName,
  x,
  y,
  info,
}: ZoneInfoProps) {
  if (!zoneName) return null
 
  return (
    <div
      className="pointer-events-none fixed z-[9999] min-w-[120px] -translate-x-1/2 -translate-y-full rounded-md border bg-popover px-3 py-2 shadow-md text-popover-foreground text-sm"
      style={{ left: x, top: y }}
    >
      {info ? (
        <>
          <p className="font-semibold leading-snug">{info.name}</p>
          <p className="text-muted-foreground">{info.price}</p>
        </>
      ) : (
        <p>{zoneName}</p>
      )}
    </div>
  )
}
 