import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { unzip } from '@/utils/zip'
import { fetchSeatPlanZip } from '@/services'
import { SeatPlanRecord } from '@/types'

export const SeatPlanEditButton = ({ record }: { record: SeatPlanRecord }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleEdit = async () => {
    setLoading(true)
    try {
      const blob = await fetchSeatPlanZip(record)
      const contents = await unzip(blob)
      navigate('/seat-config', { state: { record, contents } })
    } catch (err) {
      console.error(err)
      toast.error('Can not download file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleEdit}
      disabled={loading}
      title="Edit Seat Plan"
    >
      <Pencil className="w-4 h-4" />
    </Button>
  )
}