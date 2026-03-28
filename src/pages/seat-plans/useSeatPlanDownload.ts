import { useState } from 'react'
import { toast } from 'sonner'
import { fetchSeatPlanZip } from '@/services'
import { SeatPlanRecord } from '@/types/seatPlan.type'
import { DownloadFile } from '@/utils'

export const useSeatPlanDownload = () => {
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null)

  const download = async (record: SeatPlanRecord) => {
    setDownloadingId(record.id)
    try {
      const blob = await fetchSeatPlanZip(record)
      DownloadFile(blob, record.name , record.createAt)
      
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