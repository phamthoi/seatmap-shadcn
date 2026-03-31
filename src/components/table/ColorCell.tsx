import { TableCell } from '@/components/ui/table'
import { ColorCellProps } from '@/types'

export function ColorCell({ value, onChange }: ColorCellProps) {
  return (
    <TableCell>
      <div className="relative w-8 h-8">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="w-8 h-8 rounded border border-border pointer-events-none"
          style={{ backgroundColor: value }}
        />
      </div>
    </TableCell>
  )
}