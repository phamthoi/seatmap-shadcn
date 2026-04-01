export interface ZoomSliderProps {
  scale: number
}

export interface ZoomControlsProps {
  scale: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  className?: string
}