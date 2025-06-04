'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useParams, useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
import { getUserById, updateUser } from '../service'
import { UserDetailResponse } from '@/lib/type/user.interface'
import { Switch } from '@/components/ui/switch'
import { originalApiBaseUrl } from '@/lib/constants/env'
import { resolveImageUrl } from '@/lib/xutils/image'
import { errorToast, successToast } from '@/components/layouts/toast'
import { BackButton } from '@/components/section/back-btn'

export default function UserDetailPage() {
    const { id } = useParams()
    const [user, setUser] = useState<UserDetailResponse>()
    const [loading, setLoading] = useState(false)
    const router = useRouter();


    const loadUser = async () => {
        try {
            const data = await getUserById(id as string)
            setUser(data)
        } catch (err: any) {
            errorToast(err.error || 'Fail')
        }
    }

    useEffect(() => {
        if (id) loadUser()
    }, [id])

    const handleChange = (field: keyof UserDetailResponse, value: any) => {
        setUser(prev => prev ? { ...prev, [field]: value } : prev)
    }

    const handleSubmit = async () => {
        if (!user) return
        try {
            setLoading(true)
            await updateUser(user.user_id.toString(), user)
            successToast('User updated successfully')
            router.back();
        } catch (err: any) {
            errorToast(err.error || 'Fail')
        } finally {
            setLoading(false)
        }
    }

    if (!user) return <p className="p-6">Loading user...</p>

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <BackButton />
            <Card className="shadow-lg rounded-2xl">
                <CardHeader className="border-b pb-4">
                    <div className="flex items-center space-x-4">
                        <Image
                            src={resolveImageUrl(user.avatar, originalApiBaseUrl)}
                            alt="Avatar"
                            width={72}
                            height={72}
                            className="w-[72px] h-[72px] rounded-full object-cover border"
                        />
                        <div>
                            <CardTitle className="text-xl">{user.username}</CardTitle>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-8 pt-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <Label>First Name</Label>
                            <Input
                                placeholder="First Name"
                                value={user.first_name}
                                onChange={e => handleChange('first_name', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Last Name</Label>
                            <Input
                                placeholder="Last Name"
                                value={user.last_name}
                                onChange={e => handleChange('last_name', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Username</Label>
                            <Input
                                placeholder="Username"
                                value={user.username}
                                onChange={e => handleChange('username', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Phone Number</Label>
                            <Input
                                placeholder="Phone Number"
                                value={user.phone_number}
                                onChange={e => handleChange('phone_number', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Address & Bio */}
                    <div className="space-y-4">
                        <div>
                            <Label>Address</Label>
                            <Input
                                placeholder="Address"
                                value={user.address}
                                onChange={e => handleChange('address', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Bio</Label>
                            <Textarea
                                placeholder="Tell us a bit about this user..."
                                value={user.bio || ''}
                                onChange={e => handleChange('bio', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center space-x-3 pt-2">
                        <Switch
                            checked={user.is_active}
                            onCheckedChange={value => handleChange('is_active', value)}
                        />
                        <Label>Account is active</Label>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 text-right">
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}