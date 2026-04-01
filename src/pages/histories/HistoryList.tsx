import { DataTable, List } from "@/components/admin"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Download, Loader2, View } from 'lucide-react'
import { fetchHistories } from '@/services'
import { DownloadFile, transformTime, unzip } from '@/utils'
import { toast } from 'sonner'
import { TableActions } from "@/components/table/TableAction"
import { SMButton } from "@/components/button"

export const HistoryList = () => {
    const navigate = useNavigate()
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [downloadLoadingId, setDownloadLoadingId] = useState<string | null>(null)

    const handleDownload = async (record: any) => {
        setDownloadLoadingId(record.id)
        try {
            const blob = await fetchHistories(record)
            DownloadFile(blob, record.seatName, record.createAt)
            toast.success('Download successful')
        } catch (error) {
            toast.error('Download failed, no file to downloaded')
        } finally {
            setDownloadLoadingId(null)
        }
    }

    const handlePreview = async (record: any) => {
        setLoadingId(record.id)
        try {
            const blob = await fetchHistories(record)
            const contents = await unzip(blob) 
            navigate('/preview', { state: { contents}})
        } catch (err) {
            console.error(err)
            toast.error("Can not download file")
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <List
            resource="histories"
            queryOptions={{
                meta: { include: [{ relation: "user" }] }
            }}>
            <DataTable>
                <DataTable.Col source="id" />
                <DataTable.Col source="user.email" label="Email" render={(record) => record?.user?.email ?? "Hệ thống"} />
                <DataTable.Col source="seatName" />
                <DataTable.Col source="createAt" render={(record) => transformTime(record.createAt)} />
                <TableActions label="Actions" render={(record) => (
                    <>
                        <SMButton
                            variant="outline"
                            size="sm"
                            disabled={downloadLoadingId === record.id}
                            onClick={() => handleDownload(record)}
                            icon={downloadLoadingId === record.id ? Loader2 : Download}
                            title="Download History"
                            loading={downloadLoadingId === record.id}
                        />
                        <SMButton 
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(record)}
                            disabled={loadingId === record.id}
                            title="Preview History"
                            icon={loadingId === record.id ? Loader2 : View}
                            loading={loadingId === record.id}
                        />
                    </>
                )}
                />
            </DataTable>
        </List>
    )
}