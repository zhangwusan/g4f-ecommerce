import { CreateCategoryPayload } from "@/lib/type/categories.interface";


export async function addCategory(payload: CreateCategoryPayload) {
    const response = await fetch('/api/admin/products/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to add category');
    }
    return response.json();
}

export async function editCategory(id: number, payload: CreateCategoryPayload) {
    const response = await fetch(`/api/admin/products/categories/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('Failed to edit category');
    }
    return response.json();
}

export async function deleteCategory(id: number) {
    const response = await fetch(`/api/admin/products/categories/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete category');
    }
    return response.json();
}
