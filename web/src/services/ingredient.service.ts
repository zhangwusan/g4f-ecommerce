import { CreateIngredientPayload } from "@/lib/type/ingredient.interface";

export async function addIngredient(payload: CreateIngredientPayload) {
    const response = await fetch('/api/admin/products/ingredients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to add ingredients');
    }
    return response.json();
}


export async function editIngredient(id: number, payload: CreateIngredientPayload) {
    const response = await fetch(`/api/admin/products/ingredients/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('Failed to edit ingredients');
    }
    return response.json();
}

export async function deleteIngredient(id: number) {
    const response = await fetch(`/api/admin/products/ingredients/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete ingredients');
    }
    return response.json();
}

