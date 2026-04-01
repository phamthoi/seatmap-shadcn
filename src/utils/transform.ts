export const transformTime = (date: string) => {
  const d = new Date(date)

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

export function formatVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VND'
}

export function toSvgPoints(flat: number[]): string {
  return flat
    .reduce<string[]>((acc, val, i, arr) => {
      if (i % 2 === 0) acc.push(`${val},${arr[i + 1]}`)
      return acc
    }, [])
    .join(' ')
}

export function blobToUrl(image: unknown): string {
  if (image instanceof Blob) return URL.createObjectURL(image)
  if (typeof image === 'string') return image
  return ''
}
