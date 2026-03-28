import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { useSeatPlanDownload } from './useSeatPlanDownload'
import { Props } from '@/types/seatPlan.type'

export const SeatPlanDownloadButton = ({ record }: Props) => {
  const { download, downloadingId } = useSeatPlanDownload()
  const isLoading = downloadingId === record.id

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isLoading}
      onClick={() => download(record)}
    >
      {isLoading
        ? <Loader2 className="w-4 h-4 animate-spin" />
        : <Download className="w-4 h-4" />
      }
    </Button>
  )
}