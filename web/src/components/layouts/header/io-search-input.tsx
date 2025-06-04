import { Input } from '@/components/ui/input';
import { Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ImageSearchModal } from '../input-search-model/page';


export default function SearchInput({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className={`relative max-w-lg mx-auto ${className}`}>
        <Input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              router.push(`/products/search?q=${encodeURIComponent(query.trim())}`);
            }
          }}
          className="pr-10"
        />
        <Camera
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={() => setModalOpen(true)}
        />
      </div>

      <ImageSearchModal open={isModalOpen} onOpenChange={setModalOpen} />
    </>
  );
}