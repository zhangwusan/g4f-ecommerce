'use client'

import { useState, useEffect } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { ProductVariant, Value } from '@/lib/type/product.interface'

type VariantTableProps = {
  colors: Value[]
  sizes: Value[]
  statuses: Value[]
  value?: ProductVariant[]  // optional prop
  onChange?: (variants: ProductVariant[]) => void
}

export function ProductVariantTable({
  colors,
  sizes,
  statuses,
  value = [],
  onChange,
}: VariantTableProps) {
  const [rows, setRows] = useState<ProductVariant[]>(() =>
    value.length > 0
      ? value
      : [
          {
            color_id: 0,
            size_id: 0,
            price: 0,
            discount: 0,
            stock: 0,
            sku: '',
            status_id: 1,
          },
        ]
  )

  // Sync internal rows if value prop changes
  useEffect(() => {
    if (value.length > 0) {
      setRows(value)
    }
  }, [value])

  const updateRow = (
    index: number,
    field: keyof ProductVariant,
    value: string
  ) => {
    const newRows = [...rows]

    const numberFields: (keyof ProductVariant)[] = ['color_id', 'size_id', 'status_id']
    const floatFields: (keyof ProductVariant)[] = ['price', 'discount']
    const intFields: (keyof ProductVariant)[] = ['stock']

    let parsedValue: string | number = value
    if (numberFields.includes(field)) {
      parsedValue = Number(value)
    } else if (floatFields.includes(field)) {
      parsedValue = parseFloat(value)
    } else if (intFields.includes(field)) {
      parsedValue = parseInt(value, 10)
    }

    newRows[index] = {
      ...newRows[index],
      [field]: parsedValue,
    }

    setRows(newRows)
    onChange?.(newRows)
  }

  const addRow = () => {
    const newRow: ProductVariant = {
      color_id: 0,
      size_id: 0,
      price: 0,
      discount: 0,
      stock: 0,
      sku: '',
      status_id: 1,
    }
    const newRows = [...rows, newRow]
    setRows(newRows)
    onChange?.(newRows)
  }

  const removeRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index)
    setRows(newRows)
    onChange?.(newRows)
  }

  return (
    <div className="w-full overflow-x-auto border rounded-md">
      <table className="w-full min-w-[800px] border-collapse text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="px-3 py-2 font-medium">Color</th>
            <th className="px-3 py-2 font-medium">Size</th>
            <th className="px-3 py-2 font-medium">Price</th>
            <th className="px-3 py-2 font-medium">Discount</th>
            <th className="px-3 py-2 font-medium">Stock</th>
            <th className="px-3 py-2 font-medium">SKU</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t">
              {/* Color */}
              <td className="px-3 py-2">
                <Select
                  value={String(row.color_id)}
                  onValueChange={(val) => updateRow(index, 'color_id', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>

              {/* Size */}
              <td className="px-3 py-2">
                <Select
                  value={String(row.size_id)}
                  onValueChange={(val) => updateRow(index, 'size_id', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>

              {/* Price */}
              <td className="px-3 py-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={String(row.price)}
                  onChange={(e) => updateRow(index, 'price', e.target.value)}
                />
              </td>

              {/* Discount */}
              <td className="px-3 py-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={String(row.discount)}
                  onChange={(e) => updateRow(index, 'discount', e.target.value)}
                />
              </td>

              {/* Stock */}
              <td className="px-3 py-2">
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={String(row.stock)}
                  onChange={(e) => updateRow(index, 'stock', e.target.value)}
                />
              </td>

              {/* SKU */}
              <td className="px-3 py-2">
                <Input
                  value={row.sku}
                  onChange={(e) => updateRow(index, 'sku', e.target.value)}
                />
              </td>

              {/* Status */}
              <td className="px-3 py-2">
                <Select
                  value={String(row.status_id)}
                  onValueChange={(val) => updateRow(index, 'status_id', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>

              {/* Delete */}
              <td className="px-3 py-2 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(index)}
                  disabled={rows.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <Button type="button" onClick={addRow}>+ Add Variant</Button>
      </div>
    </div>
  )
}