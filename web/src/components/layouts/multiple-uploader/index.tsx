'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

type ImageUploadProps = {
  value?: string[] // base64 strings only
  onChange?: (files: string[]) => void
}

export function MultiImageUploader({ value = [], onChange }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setImages(value)
  }, [value])

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFilesChange = async (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const base64Images = await Promise.all(fileArray.map(fileToBase64))
    const updatedImages = [...images, ...base64Images]

    console.log('Updated images:', updatedImages)

    setImages(updatedImages)
    onChange?.(updatedImages)
  }

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
    onChange?.(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((src, index) => (
          <div key={index} className="relative w-32 h-32 rounded overflow-hidden border">
            <img src={src} alt={`preview-${index}`} className="w-full h-full object-cover" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 bg-white/70 rounded-full"
              onClick={() => handleRemove(index)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => handleFilesChange(e.target.files)}
      />

      <Button type="button" onClick={() => fileInputRef.current?.click()}>Upload Images</Button>
    </div>
  )
}