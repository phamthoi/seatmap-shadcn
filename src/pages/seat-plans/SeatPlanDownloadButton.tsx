import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { fetchSeatPlanZip } from '@/services'
import { Props } from '@/types/seatPlan.type'
import { DownloadFile } from '@/utils'
import { toast } from 'sonner'

export const SeatPlanDownloadButton = ({ record }: Props) => {
  const [ isLoading, setIsLoading ] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const blob = await fetchSeatPlanZip(record)
      DownloadFile(blob, record.name, record.createAt)
      toast.success('Download successful')
    } catch (error) {
      toast.error('Download failed, no file to downloaded')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isLoading}
      onClick={() => handleDownload()}
    >
      {isLoading
        ? <Loader2 className="w-4 h-4 animate-spin" />
        : <Download className="w-4 h-4" />
      }
    </Button>
  )
}