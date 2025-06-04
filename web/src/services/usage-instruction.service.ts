import { CreateUsageInstructionPayload } from "@/lib/type/usage-instruction.interface";


export async function addUsageInstruction(payload: CreateUsageInstructionPayload) {
    const response = await fetch('/api/admin/products/usage-instructions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to add usage-instructions');
    }
    return response.json();
}


export async function editUsageInstruction(id: number, payload: CreateUsageInstructionPayload) {
    const response = await fetch(`/api/admin/products/usage-instructions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('Failed to edit usage-instructions');
    }
    return response.json();
}

export async function deleteUsageInstruction(id: number) {
    const response = await fetch(`/api/admin/products/usage-instructions/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete usage-instructions');
    }
    return response.json();
}

