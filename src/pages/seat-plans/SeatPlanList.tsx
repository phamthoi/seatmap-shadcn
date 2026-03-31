import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Download } from 'lucide-react'
import { toast } from 'sonner'
import { unzip } from '@/utils/zip'
import { fetchSeatPlanZip } from '@/services'
import { DataTable, List } from '@/components/admin'
import { SMButton } from '@/components/button'
import { TableActions } from '@/components/table/TableAction'
import { DownloadFile, transformTime } from '@/utils'

export const SeatPlanList = () => {
  const navigate = useNavigate()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [downloadLoadingId, setDownloadLoadingId] = useState<string | null>(null)

  const handleEdit = async (record: any) => {
    setLoadingId(record.id)
    try {
      const blob = await fetchSeatPlanZip(record)
      const contents = await unzip(blob)
      navigate('/seat-config', { state: { record, contents } })
    } catch (err) {
      console.error(err)
      toast.error('Can not download file')
    } finally {
      setLoadingId(null)
    }
  }

   const handleDownload = async (record: any) => {
    setDownloadLoadingId(record.id)
    try {
      const blob = await fetchSeatPlanZip(record)
      DownloadFile(blob, record.name, record.createAt)
      toast.success('Download successful')
    } catch (error) {
      toast.error('Download failed, no file to downloaded')
    } finally {
      setDownloadLoadingId(null)
    }
  }

  return (
    <List
      resource="seat-plans"
      queryOptions={{
        meta: {
          include: [
            {
              relation: 'histories',
              scope: {
                order: ['createAt DESC'],
                limit: 1,
                include: [{ relation: 'user' }],
              },
            },
          ],
        },
      }}
    >
      <DataTable>
        <DataTable.Col source="id" />
        <DataTable.Col
          source="histories[0].user.email"
          label="Email"
          render={(record) => record?.histories[0]?.user?.email ?? 'System'}
        />
        <DataTable.Col source="name" />
        <DataTable.Col source="createAt" render={(record) => transformTime(record.createAt)} />
        <DataTable.Col source="updateAt" render={(record) => transformTime(record.updateAt)} />
        <TableActions label="Actions" render={(record) => (
          <>
            <SMButton
              variant="outline"
              size="sm"
              onClick={() => handleEdit(record)}
              disabled={loadingId === record.id}
              title="Edit Seat Plan"
              icon={Pencil}
              loading={loadingId === record.id}
            />
            <SMButton 
              variant="outline"
              size="sm"
              onClick={() => handleDownload(record)}
              disabled={downloadLoadingId === record.id}
              title="Download Seat Plan"
              icon={Download}
              loading={downloadLoadingId === record.id}
            />
          </>
        )}
        />
      </DataTable>
    </List>
  )
}