'use client'

import React, { useState, useEffect } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'

export interface Value {
  id: number
  label: string
}

type CreatableMultiSelectProps = {
  options: Value[]
  selected: Value[]
  onChange: (selected: Value[]) => void
  placeholder?: string
  className?: string
  onCreate: (label: string) => Promise<Value>
  label?: string
}

export function CreatableMultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select or create...',
  className = '',
  onCreate,
  label = 'Option',
}: CreatableMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [localOptions, setLocalOptions] = useState<Value[]>(options)
  const [creating, setCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    setLocalOptions(options)
  }, [options])

  const handleSelect = (option: Value) => {
    if (!selected.find((s) => s.id === option.id)) {
      onChange([...selected, option])
    }
    setOpen(false)
    setInputValue('')
  }

  const handleCreate = async () => {
    if (!inputValue.trim()) return
    setCreating(true)
    try {
      const newOption = await onCreate(inputValue.trim())
      setLocalOptions((prev) => [...prev, newOption])
      onChange([...selected, newOption])
      setInputValue('')
      setDialogOpen(false)
      setOpen(false)
    } catch (error) {
      console.error('Failed to create new option:', error)
    } finally {
      setCreating(false)
    }
  }

  const removeSelected = (value: string | number) => {
    onChange(selected.filter((item) => item.id !== value))
  }

  const filteredOptions = localOptions.filter(
    (option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selected.find((s) => s.id === option.id)
  )

  const showCreateOption =
    inputValue.length > 0 &&
    !localOptions.some((opt) => opt.label.toLowerCase() === inputValue.toLowerCase())

  return (
    <div className={`w-full ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className="flex flex-wrap items-center gap-2 border p-2 rounded-md cursor-pointer min-h-[42px]"
            onClick={() => setOpen(true)}
          >
            {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {selected.map((item) => (
              <Badge key={item.id} variant="secondary" className="flex items-center gap-1">
                {item.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeSelected(item.id)
                  }}
                />
              </Badge>
            ))}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[300px] p-0">
          <Command>
            <div className="relative flex items-center">
              <CommandInput
                className="flex-grow pr-20"
                placeholder={placeholder}
                value={inputValue}
                onValueChange={setInputValue}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && showCreateOption) {
                    e.preventDefault()
                    setDialogOpen(true)
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                className="absolute right-2 h-8"
                onClick={() => setDialogOpen(true)}
              >
                Add New
              </Button>
            </div>

            <CommandEmpty className="p-2">
              {showCreateOption ? (
                <span>Press Enter or click "Add New" to create "{inputValue}"</span>
              ) : (
                <span>No options found</span>
              )}
            </CommandEmpty>

            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem key={option.id} onSelect={() => handleSelect(option)}>
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New {label}</DialogTitle>
          </DialogHeader>
          <Input
            placeholder={`New ${label}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={creating}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleCreate} disabled={creating || !inputValue.trim()}>
              {creating ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}