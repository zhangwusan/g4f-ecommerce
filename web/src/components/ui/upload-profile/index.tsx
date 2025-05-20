'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import { UploadCloud } from 'lucide-react';
import getCroppedImg from '@/lib/utils/cropper';

interface AvatarUploaderProps {
  avatarUrl: string;
  onFileChange: (file: File) => void;
}

export default function AvatarUploader({ avatarUrl, onFileChange }: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropper, setShowCropper] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropDone = async () => {
    const croppedBlob = await getCroppedImg(selectedImage!, croppedAreaPixels);
    const croppedFile = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });
    onFileChange(croppedFile);
    setShowCropper(false);
    setSelectedImage(null);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="relative group cursor-pointer w-[120px] aspect-square" onClick={handleClick}>
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-border">
            <Image
              src={avatarUrl || '/default-avatar.png'}
              alt="User Avatar"
              fill
              sizes='120'
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <UploadCloud className="text-white w-6 h-6" />
          </div>
        </div>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleChange} className="hidden" />
        <p className="text-sm text-muted-foreground">Click image to upload</p>
      </div>

      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="relative w-[300px] h-[300px] bg-white rounded-lg overflow-hidden">
            <Cropper
              image={selectedImage!}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <button onClick={handleCropDone} className="ml-4 bg-primary text-white px-4 py-2 rounded">
            Crop
          </button>
        </div>
      )}
    </>
  );
}