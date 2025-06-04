import { CreateColorPayload } from "@/lib/type/color.interface";

export async function addColor(payload: CreateColorPayload) {
    const response = await fetch('/api/admin/products/colors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to add colors');
    }
    return response.json();
}


export async function editColor(id: number, payload: CreateColorPayload) {
    const response = await fetch(`/api/admin/products/colors/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('Failed to edit colors');
    }
    return response.json();
}

export async function deleteColor(id: number) {
    const response = await fetch(`/api/admin/products/colors/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete colors');
    }
    return response.json();
}

