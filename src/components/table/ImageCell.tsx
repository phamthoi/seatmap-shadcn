import { TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ImagePlus, Trash2 } from 'lucide-react'
import { ImageCellProps } from '@/types'

export function ImageCell({ id, src, alt = '', onFileChange, onDelete }: ImageCellProps) {
  return (
    <TableCell>
      <input
        id={`file-upload-${id}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
      <div className="flex items-center gap-2">
        {src ? (
          <div className="relative group">
            <img
              src={src}
              alt={alt}
              className="w-15 h-15 rounded object-cover border border-border"
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onDelete}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="w-15 h-15 rounded border border-dashed border-border flex items-center justify-center text-muted-foreground">
            <ImagePlus className="w-4 h-4" />
          </div>
        )}
        <label
          htmlFor={`file-upload-${id}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 cursor-pointer"
        >
          <ImagePlus className="w-4 h-4" />
        </label>
      </div>
    </TableCell>
  )
}