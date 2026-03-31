import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SMButtonProps } from '@/types/components'

export const SMButton = ({
  icon: Icon,
  iconClassName = 'w-4 h-4',
  variant = 'outline',
  size = 'sm',
  className,
  title,
  color,
  backgroundColor,
  label,
  onClick,
  disabled = false,
  loading = false,
}: SMButtonProps) => {
  const [internalLoading, setInternalLoading] = useState(false)

  const isLoading = loading || internalLoading

  const handleClick = async () => {
    if (!onClick) return
    setInternalLoading(true)
    try {
      await onClick()
    } finally {
      setInternalLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || isLoading}
      title={title}
      className={className}
      style={{
        ...(color ? { color } : {}),
        ...(backgroundColor ? { backgroundColor } : {}),
      }}
    >
      {Icon && <Icon className={iconClassName} />}
      {label && <span className={Icon ? 'ml-1' : ''}>{label}</span>}
    </Button>
  )
}