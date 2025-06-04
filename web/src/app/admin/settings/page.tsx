'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSchemaByResource, supportedResources } from './resource.list';
import { Settings as SettingsIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Settings() {
  const router = useRouter();
  const [value, setValue] = useState('');

  const handleSelect = (selected: string) => {
    setValue(selected);
    router.push(`/admin/settings/${selected}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto">
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-6 h-6 text-gray-700" />
        <h1 className="text-2xl font-semibold">Admin Settings</h1>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="settings-select" className="text-sm font-medium text-gray-700">
          Choose a settings category:
        </label>
        <Select value={value} onValueChange={handleSelect}>
          <SelectTrigger id="settings-select" className="w-full">
            <SelectValue placeholder="Select a setting..." />
          </SelectTrigger>
          <SelectContent>
            {supportedResources.map((resource) => {
              const schema = getSchemaByResource(resource);
              return (
                <SelectItem key={resource} value={resource}>
                  {schema.title}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}