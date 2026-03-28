import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { SeatPlanRecord } from '@/types'

export const SeatPlanEditButton = ({ record }: { record: SeatPlanRecord }) => {
  const navigate = useNavigate()

  const handleEdit = () => {
    // Navigate tới route cấu hình ghế với ID của bản ghi
    navigate(`/seat-config`)
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleEdit}
      title="Chỉnh sửa sơ đồ ghế"
    >
      <Pencil className="w-4 h-4 mr-2" /> 
      Cấu hình
    </Button>
  )
}