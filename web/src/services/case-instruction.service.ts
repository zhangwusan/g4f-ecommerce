import { CreateCareIngredientPayload } from "@/lib/type/care-instruction.interface";


export async function addCareInstruction(payload: CreateCareIngredientPayload) {
    const response = await fetch('/api/admin/products/care-instructions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to add care-instructions');
    }
    return response.json();
}


export async function editCareInstruction(id: number, payload: CreateCareIngredientPayload) {
    const response = await fetch(`/api/admin/products/care-instructions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('Failed to edit care-instructions');
    }
    return response.json();
}

export async function deleteCareInstruction(id: number) {
    const response = await fetch(`/api/admin/products/care-instructions/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete care-instructions');
    }
    return response.json();
}

