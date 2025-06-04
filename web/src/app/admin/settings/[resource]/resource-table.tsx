import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ResourceTable({
  resource,
  columns,
  data,
  onDelete,
  onEdit,
}: {
  resource: string
  columns: string[]
  data: any[]
  onDelete: (id: string | number) => void
  onEdit: (item: any) => void
}) {
  if (!data.length) {
    return <div className="text-center py-8 text-muted-foreground">No records found.</div>
  }

  return (
    <div className="overflow-x-auto rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>
                {col.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => {
            const id = row.id ?? row[columns[0]] ?? idx
            return (
              <TableRow key={id} className="hover:bg-muted">
                {columns.map((col) => (
                  <TableCell key={col}>{row[col] ?? '-'}</TableCell>
                ))}
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(row)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>Delete</Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}