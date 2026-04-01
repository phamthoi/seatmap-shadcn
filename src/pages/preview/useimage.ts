import { useEffect, useRef, useState } from 'react'

/**
 * Convert map<filename, Blob> → map<filename, objectURL>
 * Khởi tạo URL ngay (sync) để tránh render đầu tiên bị rỗng.
 * Revoke URLs khi unmount hoặc khi images thay đổi để tránh memory leak.
 */
export function useImageMap(images: Record<string, Blob>): Record<string, string> {
  // Khởi tạo ngay trong useState initializer — chạy sync, không bị delay 1 frame
  const [imageMap, setImageMap] = useState<Record<string, string>>(() => {
    const urls: Record<string, string> = {}
    for (const [key, blob] of Object.entries(images)) {
      urls[key] = URL.createObjectURL(blob)
    }
    return urls
  })

  // Giữ ref để revoke đúng URLs của lần trước
  const prevUrlsRef = useRef<Record<string, string>>(imageMap)

  useEffect(() => {
    // Revoke URLs cũ
    Object.values(prevUrlsRef.current).forEach(URL.revokeObjectURL)

    const urls: Record<string, string> = {}
    for (const [key, blob] of Object.entries(images)) {
      urls[key] = URL.createObjectURL(blob)
    }

    prevUrlsRef.current = urls
    setImageMap(urls)

    return () => {
      Object.values(urls).forEach(URL.revokeObjectURL)
    }
  }, [images])

  return imageMap
}