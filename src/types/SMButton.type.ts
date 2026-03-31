import { LucideIcon } from 'lucide-react'

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

export interface SMButtonProps {
  icon?: LucideIcon
  iconClassName?: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  title?: string
  color?: string
  backgroundColor?: string
  label?: string
  onClick?: () => void | Promise<void>
  disabled?: boolean
  loading?: boolean
}
