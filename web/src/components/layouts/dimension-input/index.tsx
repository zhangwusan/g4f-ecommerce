'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type DimensionInputProps = {
  value: {
    dimension_label: string
    width: string
    height: string
    depth: string
    weight: string
  }
  onChange: (value: DimensionInputProps['value'] ) => void
}

export function DimensionInput({ value, onChange }: DimensionInputProps) {
  const handleChange = (field: keyof DimensionInputProps['value'], newValue: string) => {
    onChange({ ...value, [field]: newValue })
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="dimension_label">Dimension Label</Label>
        <Input
          id="dimension_label"
          placeholder="e.g., Small Bottle"
          value={value.dimension_label}
          onChange={(e) => handleChange('dimension_label', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="width">Width</Label>
        <Input
          id="width"
          placeholder="e.g., 5cm"
          value={value.width}
          onChange={(e) => handleChange('width', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="height">Height</Label>
        <Input
          id="height"
          placeholder="e.g., 10cm"
          value={value.height}
          onChange={(e) => handleChange('height', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="depth">Depth</Label>
        <Input
          id="depth"
          placeholder="e.g., 2cm"
          value={value.depth}
          onChange={(e) => handleChange('depth', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="weight">Weight</Label>
        <Input
          id="weight"
          placeholder="e.g., 200g"
          value={value.weight}
          onChange={(e) => handleChange('weight', e.target.value)}
        />
      </div>
    </div>
  )
}