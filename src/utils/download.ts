import FileSaver from 'file-saver'
import sanitizeFilename from 'sanitize-filename'
import moment from 'moment'

export const DownloadFile = (
  blob: Blob,
  name?: string,
  date?: string | Date,
) => {
  if (!blob) return
  const baseName = name || 'file'
  const dateStr = moment(date || new Date()).format('YYYY-MM-DD')
  const rawFileName = `${baseName}_${dateStr}`
  const safeName = sanitizeFilename(rawFileName)

  FileSaver.saveAs(blob, `${safeName}.zip`)
}