import { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ImagePlus, Save, ArrowLeft, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getDataSeatConfig, buildUpdatedZip, zip } from '@/utils'
import { uploadSeatPlanZip } from '@/services'
import { JsonIndex, SeatItemConfig, SeatData, ZipStructure } from '@/types'
import { SeatPlanRecord } from '@/types/seatPlan.type'

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
      updateItem(id, { image: URL.createObjectURL(file) })
      // setNewImageBlobs((prev) => ({ ...prev, [id]: file }))
      setNewImageBlobs((prev) =>({ ...prev, [file.name]: file}))
    }
    e.target.value = ''
  }

  const handleDeleteImage = (id: string) => {
    const item = items.find((i) => i.id === id)
    updateItem(id, { image: '', imageFileName: '' })
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <Input
            placeholder="Seat Plan Name"
            value={headerName}
            onChange={(e) => setHeaderName(e.target.value)}
            className="w-[300px]"
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <Separator />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Color</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price (VNĐ)</TableHead>
            <TableHead>Quota</TableHead>
            <TableHead>Image</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="relative w-8 h-8">
                  <input
                    type="color"
                    value={item.color}
                    onChange={(e) => updateItem(item.id, { color: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div
                    className="w-8 h-8 rounded border border-border pointer-events-none"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </TableCell>

              <TableCell>
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                />
              </TableCell>

              <TableCell>
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, { price: Number(e.target.value) })}
                />
              </TableCell>

              <TableCell>
                <Input
                  type="number"
                  value={item.quota}
                  disabled
                />
              </TableCell>

              <TableCell>
                <input
                  id={`file-upload-${item.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange(item.id)}
                />
                <div className="flex items-center gap-2">
                  {item.image ? (
                    <div className="relative group">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover border border-border"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteImage(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded border border-dashed border-border flex items-center justify-center text-muted-foreground">
                      <ImagePlus className="w-4 h-4" />
                    </div>
                  )}
                  <label 
                    htmlFor={`file-upload-${item.id}`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 cursor-pointer"
                  >
                    <ImagePlus className="w-4 h-4" />
                  </label>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}