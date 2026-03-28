import { dataProvider } from '@/provider'
import { SeatPlanRecord } from '@/types/seatPlan.type'

export const fetchSeatPlanZip = async (record: SeatPlanRecord): Promise<Blob> => {
  const response = await dataProvider.getOne('seat-plans', {
    id: `${record.id}/file`,
    meta: { responseType: 'blob' },
  })
  return response.data.fileBlob
}

export const uploadSeatPlanZip = async (
  record: SeatPlanRecord,
  zipBlob: Blob,
): Promise<void> => {
  const formData = new FormData()
  formData.append('file', zipBlob, `${record.name}.zip`)

  await dataProvider.update('seat-plans', {
    id: record.id,
    data: formData,
    previousData: record,
  })
}