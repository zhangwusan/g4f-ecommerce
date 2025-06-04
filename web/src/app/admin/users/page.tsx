'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import MuiPagination from '@/components/layouts/pagination-section'
import { CreateUserPayload, HeadersDisplay, RoleDisplay, UserDisplayResponse } from '@/lib/type/user.interface'
import UserDialog from '@/components/layouts/user-dialog'
import { createUser, deleteUser, fetchRoles, fetchUsers } from './service'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { errorToast, successToast } from '@/components/layouts/toast'

export default function Page() {
  const [users, setUsers] = useState<UserDisplayResponse[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [roles, setRoles] = useState<RoleDisplay[]>([])
  const [headers, setHeaders] = useState<HeadersDisplay[]>([])
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'id'| 'username' | 'email' | 'first_name' | 'last_name' | 'created_at' | 'updated_at'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, pagination, headers } = await fetchUsers({ limit: 10, page, search: searchTerm, order: sortOrder, sort: sortKey })
      setHeaders(headers)
      setUsers(data)
      setTotalPages(pagination.total_pages)
    } catch (err: any) {
      setError(err.error)
    } finally {
      setLoading(false)
    }
  }

  const loadRoles = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchRoles()
      setRoles(data)
    } catch (err: any) {
      setError(err.error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoles()
    loadUsers()
  }, [])

  useEffect(() => {
    loadUsers()
  }, [page, searchTerm, sortKey, sortOrder])

  const handleAddUser = async (user: CreateUserPayload) => {
    try {
      const createdUser = await createUser(user)
      successToast( 'User created successfully')
      loadUsers()
    } catch (error: any) {
      console.error('Failed to create user:')
      errorToast(error.message || 'Failed to create user')
    }
  }

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id)
      successToast('User deleted successfully')
      loadUsers()
    } catch (error: any) {
      console.error('Failed to delete user:', error.message)
      errorToast(error.message || 'Failed to delete user')
    }
  }

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={sortKey} onValueChange={(value) => setSortKey(value as typeof sortKey)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">ID</SelectItem>
              <SelectItem value="username">Username</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="first_name">First Name</SelectItem>
              <SelectItem value="last_name">Last Name</SelectItem>
              <SelectItem value="created_at">Created At</SelectItem>
              <SelectItem value="updated_at">Updated At</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as typeof sortOrder)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
          <UserDialog roles={roles} isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddUser} />
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {headers.map(h => (
                <TableHead key={h.id}>{h.label}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.user_id}>
                <TableCell>{user.user_id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.phone_number}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role_name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">
                    <Link href={`/admin/users/${user.user_id}`} key={user.user_id}>
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user.user_id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          <MuiPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  )
}