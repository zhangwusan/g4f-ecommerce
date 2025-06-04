import { PaymentDisplayHistory } from "@/lib/type/payment.interface";

export const fetchPaymentHistory = async (page = 1, limit = 10) => {
    const url = new URL('/api/auth/profile/payments', window.location.origin);
    url.searchParams.append('page', String(page));
    url.searchParams.append('limit', String(limit));

    const response = await fetch(url.toString());
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch');
    }

    return await response.json();
};

export const fetchPaymentHistoryDetail = async (payment_id: number) => {
    const url = new URL(`/api/auth/profile/payments/${payment_id}`, window.location.origin);
    const response = await fetch(url.toString());
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch');
    }

    return await response.json();
};

export const fetchPaymentPDF = async (payment_id: number) => {
    const url = new URL(`/api/auth/profile/payments/pdf/${payment_id}`, window.location.origin);
    const response = await fetch(url.toString());
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch');
    }

    return await response.json();
}