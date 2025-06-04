import { CreateBrandPayload } from "@/lib/type/brand.interface";

export async function addBrand(payload: CreateBrandPayload) {
    const response = await fetch('/api/admin/products/brands', {
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


export async function editBrand(id: number, payload: CreateBrandPayload) {
    const response = await fetch(`/api/admin/products/brands/${id}`, {
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

export async function deleteBrand(id: number) {
    const response = await fetch(`/api/admin/products/brands/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete category');
    }
    return response.json();
}

