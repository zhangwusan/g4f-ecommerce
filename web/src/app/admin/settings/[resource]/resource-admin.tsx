'use client'

import React, { useEffect, useState } from 'react'
import MuiPagination from '@/components/layouts/pagination-section'
import { toast } from '@/hooks/use-toast'
import { BaseQuery } from '@/lib/type/api-response.interface'
import { deleteResourceData, getResourceData } from './service'
import { mapRouteResource } from './map'
import { ResourceHeader } from './resource-header'
import { ResourceTable } from './resource-table'
import { ResourceFormDialog } from './resource-dialog'
import { errorToast, successToast } from '@/components/layouts/toast'
import { BackButton } from '@/components/section/back-btn'

export default function AdminResourcePage({ resource }: { resource: string }) {
    const resourceMeta = mapRouteResource[resource] || {
        title: 'Unknown Resource',
        columns: [],
        apiEndpoint: '',
    }

    const [data, setData] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [sortKey, setSortKey] = useState<string>(resourceMeta.columns[0] || 'id')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any | null>(null)

    // Reset to page 1 on resource change
    useEffect(() => {
        setPage(1)
    }, [resource])

    const loadData = async () => {
        if (!resourceMeta.apiEndpoint) return

        setLoading(true)
        setError(null)

        const query: BaseQuery = {
            page,
            limit: 10,
            sort: sortKey,
            order: sortOrder,
        }

        try {
            const result = await getResourceData(query, resourceMeta.apiEndpoint)
            setData(result.items ?? result.data ?? [])
            setTotalPages(result.pagination?.total_pages ?? 1)
        } catch (err: any) {
            setError(err.error || 'Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    // Load data on mount or when paging/sorting changes
    useEffect(() => {
        loadData()
    }, [page, sortKey, sortOrder, resourceMeta.apiEndpoint])

    const handleDelete = async (id: any) => {
        const confirm = window.confirm(`Are you sure you want to delete this ${resource}?`)
        if (!confirm) return

        try {
            await deleteResourceData(id, resourceMeta.apiEndpoint)
            successToast(`Item with ID ${id} was deleted.`)

            setPage(1) // Optional: reset to page 1
            loadData()
        } catch (err: any) {
            errorToast(err.error || 'Fail')
        }
    }

    const handleEdit = (item: any) => {
        setEditingItem(item)
        setDialogOpen(true)
    }

    const handleAdd = () => {
        setEditingItem(null)
        setDialogOpen(true)
    }

    return (
        <div className="p-6 w-full">
            <BackButton />
            <ResourceHeader
                title={resourceMeta.title}
                sortKey={sortKey}
                setSortKey={setSortKey}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                columns={resourceMeta.columns}
                onNew={handleAdd}
            />

            <ResourceFormDialog
                label={resource}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmitSuccess={() => {
                    setDialogOpen(false)
                    setEditingItem(null)
                    setPage(1)
                    loadData()
                }}
                resource={resource}
                apiEndpoint={resourceMeta.apiEndpoint}
                item={editingItem || undefined}
            />

            {loading ? (
                <div>Loading {resourceMeta.title}...</div>
            ) : error ? (
                <div className="text-destructive">Error: {error}</div>
            ) : (
                <>
                    <ResourceTable
                        resource={resource}
                        columns={resourceMeta.columns}
                        data={data}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                    <div className="flex justify-center mt-4">
                        <MuiPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                </>
            )}
        </div>
    )
}