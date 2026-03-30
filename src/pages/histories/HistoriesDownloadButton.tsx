import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { fetchHistories } from '@/services'
import { HistoryProps } from '@/types'
import { DownloadFile } from '@/utils'
import { toast } from 'sonner'

export const HistoriesDownloadButton = ({ record }: HistoryProps) => {
    const [ isLoading, setIsLoading ] = useState(false)

    const handleDownload = async () => {
        setIsLoading(true)
        try {
            const blob = await fetchHistories(record)
            DownloadFile(blob, record.seatName, record.createAt)
            toast.success('Download successful')
        } catch (error) {
            toast.error('Download failed, no file to downloaded')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Button
        variant="outline"
        size="sm"
        disabled={isLoading}
        onClick={() => handleDownload()}
        >
        {isLoading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Download className="w-4 h-4" />
        }
        </Button>
    )
}