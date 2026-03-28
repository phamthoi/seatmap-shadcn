import { useState } from 'react'
import { toast } from 'sonner'
import { unzip, zip } from '@/utils/zip'
import { fetchSeatPlanZip, uploadSeatPlanZip } from '@/services'
import { SeatPlanRecord, ZipStructure } from '@/types'

export const useSeatPlanEdit = (record: SeatPlanRecord) => {
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [contents, setContents] = useState< ZipStructure | null>(null)

    const loadContents = async () => {
        setLoading(true)
        try {
            const blob = await fetchSeatPlanZip(record)
            const contents = await unzip(blob)
            setContents(contents)
        } catch (err) {
            console.error(err)
            toast.error('Can not download file')
        } finally {
            setLoading(false)
        }
    }

    const save = async (updated: ZipStructure) => {
        setSaving(true)
        try {
            const zipBlob = await zip(updated)
            await uploadSeatPlanZip(record, zipBlob)
            toast.success('Update success')
        } catch (err) {
            console.error(err)
            toast.error('Can not update file')
        } finally {
            setSaving(false)
        }
    }

    return { loading, saving, contents, loadContents, save }
}