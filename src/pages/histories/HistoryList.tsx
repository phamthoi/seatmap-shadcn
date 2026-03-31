import { DataTable, List } from "@/components/admin"
import { useState } from "react"
import { Download, Loader2 } from 'lucide-react'
import { fetchHistories } from '@/services'
import { DownloadFile, transformTime } from '@/utils'
import { toast } from 'sonner'
import { TableActions } from "@/components/table/TableAction"
import { SMButton } from "@/components/button"

export const HistoryList = () => {
    const [downloadLoadingId, setDownloadLoadingId] = useState<string | null>(null)

    const hadnleDownload = async (record: any) => {
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
                            onClick={() => hadnleDownload(record)}
                            icon={downloadLoadingId === record.id ? Loader2 : Download}
                            title="Download History"
                            loading={downloadLoadingId === record.id}
                        />
                    </>
                )}
                />
            </DataTable>
        </List>
    )
}