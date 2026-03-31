import { ReactNode } from "react";

export interface TableActionsProps {
    render: (record: any) => React.ReactNode;
    label?: string
    className?: string
}

export interface ColorCellProps {
  value: string
  onChange: (color: string) => void
}

export interface ImageCellProps {
  id: string
  src?: string
  alt?: string
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDelete: () => void
}

export interface HeaderProps {
  title: string
  isSaving?: boolean
  placeholder?: string
  onTitleChange: (v: string) => void
  onBack: () => void
  onSave: () => void
}

export interface ColumnDef<T> {
  key: string
  label: string
  className?: string
  render: (item: T) => ReactNode
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  rowKey: (item: T) => string
}