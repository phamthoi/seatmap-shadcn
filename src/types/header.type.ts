import { ReactNode } from 'react'

export interface PageHeaderProps {
  title: string
  description?: ReactNode
  actions?: ReactNode
  className?: string
}