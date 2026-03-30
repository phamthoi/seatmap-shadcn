import { dataProvider } from '@/provider'
import { HistoryRecord } from '@/types'

export const fetchHistories = async ( record: HistoryRecord ): Promise<Blob> => {
    const response = await dataProvider.getOne('histories', {
        id: `${record.id}/file`,
        meta: { responseType: 'blob' },
    })
    return response.data.fileBlob
}
   