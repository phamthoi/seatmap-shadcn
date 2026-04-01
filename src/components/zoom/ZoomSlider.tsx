import { ZoomSliderProps } from '@/types'
import { ZOOM_MIN, ZOOM_MAX } from '@/constants'

export function ZoomSlider({ scale }: ZoomSliderProps) {
  const pct = ((scale - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN)) * 100

  return (
    <div className="relative mx-auto h-24 w-1 rounded-full bg-muted">
      <div
        className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-background bg-primary shadow"
        style={{ bottom: `${pct}%` }}
      />
    </div>
  )
}