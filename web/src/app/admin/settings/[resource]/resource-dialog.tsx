'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { addResourceData, editResourceData } from './service'
import { toast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { errorToast } from '@/components/layouts/toast'

export function ResourceFormDialog({
    open,
    onClose,
    onSubmitSuccess,
    resource,
    apiEndpoint,
    item,
    label,
}: {
    open: boolean
    onClose: () => void
    onSubmitSuccess: () => void
    resource: string
    apiEndpoint: string
    item?: any
    label: string
}) {
    const [formState, setFormState] = useState<any>(item || {})
    const isEdit = !!item

    const handleChange = (key: string, value: any) => {
        setFormState((prev: any) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        try {
            if (isEdit) {
                await editResourceData(item.id, formState, apiEndpoint)
            } else {
                await addResourceData(formState, apiEndpoint)
            }
            onSubmitSuccess()
        } catch (err: any) {
            errorToast(err.error || 'Unknown error')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? `Edit ${label}` : `Create new ${label}`}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Name"
                        value={formState.name || ''}
                        onChange={e => handleChange('name', e.target.value)}
                        className="border rounded px-3 py-2"
                    />
                    <Button onClick={handleSubmit} className="px-4 py-2 rounded">
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}