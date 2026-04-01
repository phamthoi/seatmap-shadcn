import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { JsonIndex, SeatData } from '@/types'
import { StadiumPreview } from './StadiumPreview'
import { SeatDetailView } from './SeatDetailView'
import { PageHeader } from '@/components/header'
import { useImageMap } from './useimage'

export function PreviewPage() {
  const { state } = useLocation()

  // Guard nếu navigate vào page mà không có state
  if (!state?.contents) {
    return (
      <div className="min-h-full bg-background p-6 flex items-center justify-center">
        <p className="text-muted-foreground">
          Không có dữ liệu để xem trước. Vui lòng quay lại danh sách.
        </p>
      </div>
    )
  }

  const content = state.contents
  // seats là map: zoneId → SeatData (parsed JSON)
  const seatsMap: Record<string, SeatData> = content['seats'] ?? {}
  const indexJson: JsonIndex = content['index']
  const images: Record<string, Blob> = content['images'] ?? {}

  const imageMap = useImageMap(images)

  const isSingleZone = indexJson?.seatPlanType === 'SINGLE_ZONE'

  // State quản lý zone đang được chọn (chỉ dùng khi multi-zone)
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)

  const layout = Array.isArray(indexJson?.layout) ? indexJson.layout : []

  if (import.meta.env.DEV) {
    console.group('[PreviewPage] Debug info')
    console.log('seatPlanType:', indexJson?.seatPlanType)
    console.log('isSingleZone:', isSingleZone)
    console.log('indexJson:', indexJson)
    console.log('layout.length:', layout.length)
    console.log('seatsMap keys:', Object.keys(seatsMap))
    console.log('imageMap keys:', Object.keys(imageMap))
    console.groupEnd()
  }

  // SINGLE_ZONE: lấy SeatData của zone đầu tiên (hoặc key duy nhất)
  const singleZoneSeatData: SeatData | undefined = isSingleZone
    ? Object.values(seatsMap)[0]
    : undefined

  // MULTI_ZONE + đã chọn zone: lấy SeatData theo zoneId được chọn
  const selectedSeatData: SeatData | undefined =
    !isSingleZone && selectedZoneId ? seatsMap[selectedZoneId] : undefined

  return (
    <div className="min-h-full bg-background p-6">
      <PageHeader
        title="Preview"
        description={
          <>
            Xem trước giao diện bán vé với{' '}
            <strong className="text-foreground">{layout.length}</strong> khu vực
          </>
        }
      />

      <main className="flex flex-1 gap-4 overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
        {/* ── CASE 1: SINGLE_ZONE ── đi thẳng vào SeatDetailView */}
        {isSingleZone && singleZoneSeatData && (
          <div className="flex-1 overflow-hidden">
            <SeatDetailView
              indexData={indexJson}
              imageMap={imageMap}
              seatData={singleZoneSeatData}
              className="h-full"
            />
          </div>
        )}

        {/* ── CASE 2: MULTI_ZONE ── StadiumPreview bên trái, SeatDetailView bên phải khi đã chọn */}
        {!isSingleZone && (
          <>
            {/* StadiumPreview luôn hiển thị */}
            <div className={selectedZoneId ? 'w-1/2 overflow-hidden' : 'flex-1 overflow-hidden'}>
              <StadiumPreview
                indexData={indexJson}
                imageMap={imageMap}
                onZoneClick={(zoneId) => setSelectedZoneId(zoneId)}
                className="h-full"
              />
            </div>

            {/* SeatDetailView chỉ hiện khi đã chọn zone và có data */}
            {selectedZoneId && selectedSeatData && (
              <div className="w-1/2 overflow-hidden">
                <SeatDetailView
                  indexData={indexJson}
                  seatData={selectedSeatData}
                  imageMap={imageMap}
                  onBack={() => setSelectedZoneId(null)}
                  className="h-full"
                />
              </div>
            )}

            {/* Placeholder khi chưa chọn zone nào */}
            {!selectedZoneId && (
              <div className="hidden" /> // không cần hiển thị gì thêm
            )}
          </>
        )}
      </main>
    </div>
  )
}