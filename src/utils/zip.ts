import JSZip from 'jszip'
import { toast } from 'sonner'
import { ZipStructure, JsonIndex, SeatData } from '@/types'

export const unzip = async (blob: Blob): Promise<ZipStructure> => {
    if(!blob) toast.error('Blob data is empty');

    const zip = await JSZip.loadAsync(blob);
    const result: ZipStructure = {
        index: {} as JsonIndex,
        seats: {},
        images: {}
    }

    const fileEntries = Object.entries(zip.files)

    for (const [fileName, file] of fileEntries) {
        if (file.dir) continue;
        
        if (fileName.toLowerCase() === 'index.json') {
            const content = await file.async('string');
            result.index = JSON.parse(content)
        }
        
        else if (fileName.endsWith('.json')) {
            const content = await file.async('string');
            const parsedSeat = JSON.parse(content) as SeatData;
            result.seats[fileName] = parsedSeat;
        } 
            
        else if (/\.(png|jpg|jpeg|gif|svg)$/i.test(fileName)) {
            const imgBlob = await file.async('blob');
            result.images[fileName] = imgBlob;
        }
    }
    
    return result
}

export const zip = async (contents: ZipStructure): Promise<Blob> => {
  const zip = new JSZip()

  zip.file('index.json', JSON.stringify(contents.index, null, 2))

  Object.entries(contents.seats).forEach(([name, data]) => {
    zip.file(name, JSON.stringify(data, null, 2))
  })

  Object.entries(contents.images).forEach(([name, blob]) => {
    zip.file(name, blob)
  })

  return zip.generateAsync({ type: 'blob' })
}