'use client';

import React, { useState } from 'react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription,
} from '@/components/ui/dialog';

export interface SelectOrAddNewField {
  name: string;
  label: string;
  placeholder?: string;
}

export interface SelectOrAddNewProps<T> {
  label: string;
  items: T[];
  valueKey: keyof T;
  labelKey: keyof T;
  value: string;
  placeholder?: string;
  onChange: (val: string | number) => void;
  onCreate: (payload: Record<string, any>) => Promise<T>;
  fields: SelectOrAddNewField[];
}

export function SelectOrAddNew<T>({
  label,
  items,
  valueKey,
  labelKey,
  value,
  placeholder = 'Select an option',
  onChange,
  onCreate,
  fields,
}: SelectOrAddNewProps<T>) {
  const [openCreate, setOpenCreate] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!formData.name?.trim()) return;
    setLoading(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, v.trim()])
      );
      const created = await onCreate(payload);
      setFormData({});
      setOpenCreate(false);
      onChange(created[valueKey] as any);
    } catch (err) {
      console.error('Failed to create:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      <Select
        onValueChange={val => {
          if (val === 'add_new') {
            setTimeout(() => {
              setFormData({});
              setOpenCreate(true);
            }, 50);
          } else {
            onChange(val);
          }
        }}
        value={value || ''}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map(item => (
            <SelectItem
              key={String(item[valueKey])}
              value={String(item[valueKey])}
              className="px-2"
            >
              {String(item[labelKey])}
            </SelectItem>
          ))}
          <SelectItem value="add_new" className="text-blue-600">
            {'\u2795'} Add new
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Create Dialog */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New {label}</DialogTitle>
            <DialogDescription>Fill out the form to add a new {label.toLowerCase()}.</DialogDescription>
          </DialogHeader>

          {fields.map(field => (
            <div key={field.name} className="mb-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                placeholder={field.placeholder || ''}
                value={formData[field.name] || ''}
                onChange={e =>
                  setFormData(prev => ({ ...prev, [field.name]: e.target.value }))
                }
              />
            </div>
          ))}

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleCreate}
              disabled={loading || !formData.name?.trim()}
            >
              {loading ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}