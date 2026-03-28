import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImagePlus, Save, ArrowLeft, Trash2 } from 'lucide-react'

export function SeatConfigPage() {
  // Giả sử contents được load từ hook useSeatPlanEdit của bạn
  const [zones, setZones] = useState([
    { id: 1, name: 'VIP', color: '#ff0000', quota: 50, price: 500000, image: null },
    { id: 2, name: 'Standard', color: '#00ff00', quota: 100, price: 200000, image: null },
  ])

  const handleUploadImage = (id: number) => {
    // Logic trigger input file ẩn và cập nhật image cho zone đó
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
        <Button className="bg-blue-600">
          <Save className="w-4 h-4 mr-2" /> Lưu cấu hình
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cấu hình khu vực ghế</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Màu sắc</TableHead>
                <TableHead>Tên khu</TableHead>
                <TableHead>Giá (VNĐ)</TableHead>
                <TableHead>Số lượng (Quota)</TableHead>
                <TableHead>Hình ảnh</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="color" 
                        value={zone.color} 
                        className="w-10 h-10 p-1 cursor-pointer"
                        onChange={(e) => {/* update color */}}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input value={zone.name} onChange={(e) => {/* update name */}} />
                  </TableCell>
                  <TableCell>
                    <Input type="number" value={zone.price} />
                  </TableCell>
                  <TableCell>
                    <Input type="number" value={zone.quota} />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" onClick={() => handleUploadImage(zone.id)}>
                      <ImagePlus className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}