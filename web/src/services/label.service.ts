import { CreateLabelProductPayload } from "@/lib/type/label.interface";

export async function addLabel(payload: CreateLabelProductPayload) {
    const response = await fetch('/api/admin/products/labels', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to add labels');
    }
    return response.json();
}


export async function editLabel(id: number, payload: CreateLabelProductPayload) {
    const response = await fetch(`/api/admin/products/labels/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('Failed to edit labels');
    }
    return response.json();
}

export async function deleteLabel(id: number) {
    const response = await fetch(`/api/admin/products/labels/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete labels');
    }
    return response.json();
}

