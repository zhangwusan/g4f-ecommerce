

export const generate2FA = async () => {
    const url = new URL('/api/auth/e2fa/generate', window.location.origin);

    const response = await fetch(url.toString(), {
        method: 'POST'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch');
    }

    const { data, message } = await response.json();
    return data
}

export const enable2FA = async (code: string) => {
    const url = new URL('/api/auth/e2fa/enable', window.location.origin);

    const response = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({ code })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch');
    }

    return await response.json();
}

export const disable2FA = async (code: string) => {
    const url = new URL('/api/auth/e2fa/disable', window.location.origin);

    const response = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({ code })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch');
    }

    return await response.json();
}

export const verify2FA = async (code: string, token: string) => {
    const url = new URL('/api/auth/e2fa/verify', window.location.origin);

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, token }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '2FA verification failed');
    }

    return await response.json();
};