import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { ZoomControlsProps } from '@/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ZoomSlider } from './ZoomSlider'

export function ZoomControls({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
  className,
}: ZoomControlsProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 rounded-lg border bg-background p-1 shadow-md',
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomIn}
        title="Phóng to"
        className="h-7 w-7"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
 
      <ZoomSlider scale={scale} />
 
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomOut}
        title="Thu nhỏ"
        className="h-7 w-7"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
 
      <Button
        variant="ghost"
        size="icon"
        onClick={onReset}
        title="Reset"
        className="h-7 w-7"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  )
}