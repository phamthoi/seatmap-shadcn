import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { HeaderProps } from '@/types'

export function Header({
  title,
  isSaving = false,
  placeholder = 'Name',
  onTitleChange,
  onBack,
  onSave,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Input
          placeholder={placeholder}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-[300px]"
        />
      </div>
      <Button onClick={onSave} disabled={isSaving}>
        {isSaving
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
          : <><Save className="w-4 h-4 mr-2" /> Save</>
        }
      </Button>
    </div>
  )
}