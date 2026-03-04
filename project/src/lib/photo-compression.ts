/**
 * Photo Compression Utility
 * Compress images before upload to Supabase Storage
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const COMPRESSED_SIZE = 500 * 1024 // 500KB target
const QUALITY = 0.7 // 70% quality for WebP

/**
 * Validate image file
 * @param file - File to validate
 * @throws Error if file is invalid
 */
export function validateImageFile(file: File): void {
  if (!file) {
    throw new Error('Nenhum arquivo selecionado')
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  if (!validTypes.includes(file.type)) {
    throw new Error('Tipo de arquivo inválido. Use PNG, JPG ou WEBP')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Arquivo muito grande. Máximo 5MB (você enviou ${(file.size / 1024 / 1024).toFixed(1)}MB)`)
  }
}

/**
 * Compress image using Canvas API
 * @param file - Image file to compress
 * @returns Compressed image as Blob
 */
export async function compressImage(file: File): Promise<Blob> {
  validateImageFile(file)

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const img = new Image()

        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            throw new Error('Could not get canvas context')
          }

          // Calculate new dimensions (max width: 1200px, maintain aspect ratio)
          const maxWidth = 1200
          let width = img.width
          let height = img.height

          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height

          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to WebP with quality
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                throw new Error('Failed to compress image')
              }

              console.log(
                `📸 Image compressed: ${(file.size / 1024).toFixed(1)}KB → ${(blob.size / 1024).toFixed(1)}KB`
              )

              resolve(blob)
            },
            'image/webp',
            QUALITY
          )
        }

        img.onerror = () => {
          reject(new Error('Failed to load image'))
        }

        img.src = event.target?.result as string
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Get file size in MB
 */
export function getFileSizeMB(bytes: number): number {
  return bytes / 1024 / 1024
}
