import { CreateTagPayload } from "@/lib/type/tag.interface";


export async function addTag(payload: CreateTagPayload) {
    const response = await fetch('/api/admin/products/tags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to add tags');
    }
    return response.json();
}


export async function editTag(id: number, payload: CreateTagPayload) {
    const response = await fetch(`/api/admin/products/tags/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('Failed to edit tags');
    }
    return response.json();
}

export async function deleteTag(id: number) {
    const response = await fetch(`/api/admin/products/tags/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete tags');
    }
    return response.json();
}

