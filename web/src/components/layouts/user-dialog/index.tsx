'use client';

import React, { useCallback, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateUserPayload, RoleDisplay } from '@/lib/type/user.interface';
import { Checkbox } from '@/components/ui/checkbox';
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/lib/xutils/cropper';


interface UserDialogProps {
    roles: RoleDisplay[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSubmit: (user: CreateUserPayload) => void;
}

export default function UserDialog({ roles, isOpen, setIsOpen, onSubmit }: UserDialogProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [showCropper, setShowCropper] = useState(false)

    const [user, setUser] = useState<CreateUserPayload>({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        phone_number: '',
        address: '',
        avatar: '', // Base64-encoded image string
        is_active: true,
        bio: '',
        role_id: 2,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as any;
        setUser(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setUser(prev => ({ ...prev, avatar: base64String }));
        };
        reader.readAsDataURL(file);
    };

    const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropDone = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        const blob = await getCroppedImg(imageSrc, croppedAreaPixels);

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result as string;
            setUser(prev => ({ ...prev, avatar: base64data }));
            setShowCropper(false);
        };
        reader.readAsDataURL(blob);
    };

    const handleSubmit = () => {
        onSubmit(user);
        setIsOpen(false);
        setUser({
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            password: '',
            confirm_password: '',
            phone_number: '',
            address: '',
            avatar: '',
            is_active: true,
            bio: '',
            role_id: 2,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Add User</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto justify-center">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-center text-xl font-semibold">Create New User</DialogTitle>
                </DialogHeader>

                {/* Avatar upload + crop */}
                <div className="flex flex-col items-center justify-center py-4">
                    <Label className="mb-2">Avatar</Label>
                    <Label
                        htmlFor="avatar-upload"
                        className="w-24 h-24 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:border-blue-500 transition"
                    >
                        {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <span className="text-sm text-gray-500">Upload</span>
                        )}
                    </Label>
                    <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </div>

                {/* Cropper modal */}
                {showCropper && imageSrc && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                        <div className="relative bg-white rounded-lg p-4 w-[90vw] max-w-md">
                            <div className="relative aspect-square w-full h-64">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="ghost" onClick={() => setShowCropper(false)}>Cancel</Button>
                                <Button onClick={handleCropDone}>Crop</Button>
                            </div>
                        </div>
                    </div>
                )}


                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>First Name</Label>
                            <Input name="first_name" value={user.first_name} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Last Name</Label>
                            <Input name="last_name" value={user.last_name} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Username</Label>
                            <Input name="username" value={user.username} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input type="email" name="email" value={user.email} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input type="password" name="password" value={user.password} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Confirm Password</Label>
                            <Input
                                type="password"
                                name="confirm_password"
                                value={user.confirm_password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label>Phone Number</Label>
                            <Input name="phone_number" value={user.phone_number} onChange={handleChange} />
                        </div>
                        <div className="col-span-1">
                            <Label htmlFor="role_id">Role</Label>
                            <Select
                                value={user.role_id.toString()}
                                onValueChange={(value) =>
                                    setUser((prev) => ({ ...prev, role_id: Number(value) }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id.toString()}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='col-span-2'>
                            <Label>Address</Label>
                            <Input name="address" value={user.address} onChange={handleChange} />
                        </div>
                        <div className="col-span-2">
                            <Label>Bio</Label>
                            <textarea
                                name="bio"
                                value={user.bio}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div className="col-span-1 flex items-center gap-2">
                            <Checkbox
                                id="is_active"
                                checked={user.is_active}
                                onCheckedChange={(checked) =>
                                    setUser((prev) => ({ ...prev, is_active: Boolean(checked) }))
                                }
                            />
                            <Label htmlFor="is_active" className="text-sm font-medium">
                                Active
                            </Label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>Save</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}