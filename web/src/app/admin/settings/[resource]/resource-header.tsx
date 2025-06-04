import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ResourceHeader({
    title,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
    columns,
    onNew,
}: {
    title: string
    sortKey: string
    setSortKey: (val: string) => void
    sortOrder: 'asc' | 'desc'
    setSortOrder: (val: 'asc' | 'desc') => void
    columns: string[]
    onNew: () => void
}) {
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">{title}</h1>
            <div className="flex flex-wrap gap-4 items-center">
                <Select value={sortKey} onValueChange={(value) => setSortKey(value)}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        {columns.map((col) => (
                            <SelectItem key={col} value={col}>
                                {col.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    onClick={onNew}
                    className="rounded-md bg-primary px-4 py-2 hover:bg-primary/90"
                >
                    + New
                </Button>
            </div>
        </div>
    )
}