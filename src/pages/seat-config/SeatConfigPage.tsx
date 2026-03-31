import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { getDataSeatConfig, buildUpdatedZip, zip } from '@/utils'
import { uploadSeatPlanZip } from '@/services'
import { JsonIndex, SeatItemConfig, SeatData, ZipStructure, ColumnDef, SeatPlanRecord } from '@/types'
import { ColorCell, ImageCell, DataTable, Header } from '@/components/table'

const buildColumns = (
  onUpdate: (id: string, patch: Partial<SeatItemConfig>) => void,
  onFileChange: (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => void,
  onDeleteImage: (id: string) => void,
): ColumnDef<SeatItemConfig>[] => [
  {
    key: 'color',
    label: 'Color',
    className: 'w-',
    render: (item) => (
      <ColorCell
        value={item.color}
        onChange={(color) => onUpdate(item.id, { color })}
      />
    ),
  },
  {
    key: 'name',
    label: 'Name',
    render: (item) => (
      <Input
        value={item.name}
        onChange={(e) => onUpdate(item.id, { name: e.target.value })}
      />
    ),
  },
  {
    key: 'price',
    label: 'Price (VNĐ)',
    render: (item) => (
      <Input
        type="number"
        value={item.price}
        onChange={(e) => onUpdate(item.id, { price: Number(e.target.value) })}
      />
    ),
  },
  {
    key: 'quota',
    label: 'Quota',
    render: (item) => <Input type="number" value={item.quota} disabled />,
  },
  {
    key: 'image',
    label: 'Image',
    render: (item) => (
      <ImageCell
        id={item.id}
        src={item.image}
        alt={item.name}
        onFileChange={onFileChange(item.id)}
        onDelete={() => onDeleteImage(item.id)}
      />
    ),
  },
]

function blobToUrl(image: unknown): string {
  if (image instanceof Blob) return URL.createObjectURL(image)
  if (typeof image === 'string') return image
  return ''
}

function normalizeItems(raw: SeatItemConfig[]): SeatItemConfig[] {
  return raw.map((item) => ({ ...item, image: blobToUrl(item.image) }))
}

export function SeatConfigPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const record: SeatPlanRecord = state?.record
  const contents: ZipStructure = state?.contents ?? {}
  const seats: Record<string, SeatData> = contents['seats'] ?? {}
  const indexJson: JsonIndex = contents['index']
  const images: Record<string, Blob> = contents['images'] ?? {}
  const [headerName, setHeaderName] = useState(indexJson?.name ?? '')
  const [isSaving, setIsSaving] = useState(false)

  const [items, setItems] = useState<SeatItemConfig[]>(() =>
    normalizeItems(getDataSeatConfig(indexJson, seats, images))
  )

  const [newImageBlobs, setNewImageBlobs] = useState<Record<string, Blob>>({})

  const updateItem = (id: string, patch: Partial<SeatItemConfig>) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )

  const handleFileChange = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageKey = `${id}.png`
      const prevItem = items.find((i) => i.id === id)

      if (prevItem?.image?.startsWith('blob:')) {
        URL.revokeObjectURL(prevItem.image)
      }

      updateItem(id, {
        image: URL.createObjectURL(file),
        imageFileName: imageKey,
      })
      setNewImageBlobs((prev) => ({ ...prev, [imageKey]: file }))
    }
    e.target.value = ''
  }

  const handleDeleteImage = (id: string) => {
    const item = items.find((i) => i.id === id)

    if (item?.image?.startsWith('blob:')) {
      URL.revokeObjectURL(item.image)
    }

    updateItem(id, { image: '', imageDeleted: true })
    setNewImageBlobs((prev) => {
      const next = { ...prev }
      if (item?.imageFileName) delete next[item.imageFileName]
      return next
    })
  }

  const handleSave = async () => {
    if (!record) {
      toast.error('Record data is missing, cannot save changes.')
      return
    }

    try {
      setIsSaving(true)
      const updatedZip = buildUpdatedZip(
        contents,
        headerName,
        items,
        newImageBlobs,
      )
      const zipBlob = await zip(updatedZip)

      await uploadSeatPlanZip(record, zipBlob)

      setNewImageBlobs({})

      toast.success('Changes saved successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to save changes, please try again')
    } finally {
      setIsSaving(false)
    }
  }

  const columns = buildColumns(updateItem, handleFileChange, handleDeleteImage)
  return (
    <div className="p-6 space-y-6">
      <Header
        title={headerName}
        isSaving={isSaving}
        placeholder="Seat Plan Name"
        onTitleChange={setHeaderName}
        onBack={() => navigate(-1)}
        onSave={handleSave}
      />
      <Separator />
      <DataTable
        columns={columns}
        data={items}
        rowKey={(item) => item.id}
      />
    </div>
  )
}