import { BaseQuery } from "@/lib/type/api-response.interface";

export async function getResourceData(query: BaseQuery, api_resource_path: string) {
    const defaults: Record<string, string> = {
        sort: 'id',
        order: 'asc',
        page: '1',
        limit: '10',
        search: '',
    };

    const queryParams = new URLSearchParams();

    for (const key in defaults) {
        const value = query[key as keyof BaseQuery];
        if (value !== undefined) {
            queryParams.set(key, String(value));
        }
    }

    if (query.filter) {
        for (const [k, v] of Object.entries(query.filter)) {
            queryParams.set(`filter[${k}]`, v);
        }
    }

    if (query.tags) {
        for (const tag of query.tags) {
            queryParams.append('tags', tag);
        }
    }

    const url = new URL(api_resource_path, window.location.origin);
    url.search = queryParams.toString();

    console.log("Url : ", url.toString())

    const response = await fetch(url.toString());
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch');
    }

    return await response.json();
}

export async function addResourceData(payload: any, api_resource_path: string) {
    const url = new URL(api_resource_path, window.location.origin)

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to add resource')
    }

    return await response.json()
}

export async function deleteResourceData(id: number, api_resource_path: string) {
    const url = new URL(`${api_resource_path}/${id}`, window.location.origin);
    const response = await fetch(url.toString(), {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete resource');
    }

    return await response.json();
}

export async function editResourceData(id: number, payload: any, api_resource_path: string) {
    const url = new URL(`${api_resource_path}/${id}`, window.location.origin);

    const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update resource');
    }

    return await response.json();
}