import { useState } from 'react'
import { toast } from 'sonner'
import { downloadSeatPlanFile } from './seat-plans.api'
import { SeatPlanRecord } from '@/types/seatPlan.type'

export const useSeatPlanDownload = () => {
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null)

  const download = async (record: SeatPlanRecord) => {
    setDownloadingId(record.id)
    try {
      await downloadSeatPlanFile(record)
      toast.success('Download success')
    } catch (err) {
      console.error(err)
      toast.error('Download error!')
    } finally {
      setDownloadingId(null)
    }
  }

  return { download, downloadingId }
}