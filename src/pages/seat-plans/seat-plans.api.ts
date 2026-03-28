import { dataProvider } from '@/provider'
import FileSaver from 'file-saver'
import sanitizeFilename from 'sanitize-filename'
import moment from 'moment'
import { SeatPlanRecord } from '@/types/seatPlan.type'

export const downloadSeatPlanFile = async (record: SeatPlanRecord): Promise<void> => {
  const response = await dataProvider.getOne('seat-plans', {
    id: `${record.id}/file`,
    meta: { responseType: 'blob' },
  })

  const blob = response.data.fileBlob

  const rawName =
    record.originalFilename ||
    `${record.name}_${moment(record.createAt).format('YYYY-MM-DD')}`

  const safeName = sanitizeFilename(rawName)

  FileSaver.saveAs(blob, `${safeName}.zip`)
}