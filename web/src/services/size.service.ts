import { CreateSizePayload } from "@/lib/type/size.interface";

export async function addSize(payload: CreateSizePayload) {
    const response = await fetch('/api/admin/products/sizes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to add sizes');
    }
    return response.json();
}


export async function editSize(id: number, payload: CreateSizePayload) {
    const response = await fetch(`/api/admin/products/sizes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('Failed to edit sizes');
    }
    return response.json();
}

export async function deleteSize(id: number) {
    const response = await fetch(`/api/admin/products/sizes/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete sizes');
    }
    return response.json();
}

