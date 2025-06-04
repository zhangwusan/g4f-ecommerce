'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'; // Assuming shadcn or similar
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ImageSearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSearch = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      const res = await fetch('/api/products/search-by-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.query) {
        router.push(`/products/search?q=${encodeURIComponent(data.query)}`);
      } else if (data.productId) {
        router.push(`/products/${data.productId}`);
      }
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUrlSearch = async () => {
    if (!imageUrl.trim()) return;
    try {
      const res = await fetch('/api/products/search-by-image-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl.trim() }),
      });
      const data = await res.json();
      if (data.query) {
        router.push(`/products/search?q=${encodeURIComponent(data.query)}`);
      } else if (data.productId) {
        router.push(`/products/${data.productId}`);
      }
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      previewFile(e.dataTransfer.files[0]);
    }
  }, []);

  const cancelPreview = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    setImageUrl('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle>Search by Image</DialogTitle>
        {!previewImage ? (
          <>
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) =>
                e.target.files?.length && previewFile(e.target.files[0])
              }
            />
            <div
              className="border-2 border-dashed p-6 text-center rounded-md cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              Drag and drop or click to upload an image
            </div>
            <div className="my-4">
              <Input
                type="url"
                placeholder="Paste image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
              <Button
                className="mt-2 w-full"
                disabled={!imageUrl.trim()}
                onClick={handleUrlSearch}
              >
                Search by URL
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-48 mx-auto mb-4 rounded-md border"
            />
            <div className="flex gap-2 justify-center">
              <Button onClick={handleImageSearch}>Search Image</Button>
              <Button variant="secondary" onClick={cancelPreview}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}