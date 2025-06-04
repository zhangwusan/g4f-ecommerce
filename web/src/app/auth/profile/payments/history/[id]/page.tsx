'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentDetail } from '@/lib/type/payment.interface';
import { fetchPaymentHistoryDetail, fetchPaymentPDF } from '../../service';
import { previewBase64PDF } from '@/lib/xutils/pdf';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/section/back-btn';

export default function PaymentDetailPage() {
    const { id } = useParams();
    const [data, setData] = useState<PaymentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchPaymentHistoryDetail(Number(id));
                setData(result);
            } catch (err: any) {
                setErrorMsg(err.error);
            } finally {
                setLoading(false);
            }
        };

        if (id) loadData();
    }, [id]);

    const handleViewPDF = async () => {
        try {
            const result = await fetchPaymentPDF(Number(id));
            await previewBase64PDF(result.data);

        } catch (err: any) {
            setErrorMsg(err.error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
    if (errorMsg) return <p className="p-6 text-red-600">Error: {errorMsg}</p>;
    if (!data) return <p className="p-6">No payment detail found.</p>;

    return (
        <div className="p-6 space-y-6">
            <div className='flex justify-between items-center'>
                <BackButton />
                <h1 className="text-2xl font-semibold">Payment Detail</h1>
                <Button
                    onClick={() => handleViewPDF()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Preview PDF
                </Button>
            </div>

            <Card>
                <CardContent className="space-y-2 p-4">
                    <p><strong>Transaction ID:</strong> {data.payment_transaction}</p>
                    <p><strong>Method:</strong> {data.payment_method}</p>
                    <p><strong>Amount:</strong> ${data.payment_amount.toFixed(2)}</p>
                    <p><strong>Status:</strong> {data.payment_status}</p>
                    <p><strong>Date:</strong> {new Date(data.payment_date).toLocaleString()}</p>
                </CardContent>
            </Card>

            <h2 className="text-xl font-semibold">Order Information</h2>
            <Card>
                <CardContent className="space-y-2 p-4">
                    <p><strong>Username:</strong> {data.order_username}</p>
                    <p><strong>Status:</strong> {data.order_status}</p>
                    <p><strong>Shipping Address:</strong> {data.order_shipping_address}</p>
                    <p><strong>Total:</strong> ${data.order_total_amount.toFixed(2)}</p>
                    <p><strong>Order Date:</strong> {new Date(data.order_date).toLocaleString()}</p>
                </CardContent>
            </Card>

            <h2 className="text-xl font-semibold">Order Items</h2>
            <div className="grid gap-4 md:grid-cols-2">
                {data.order_items.map((item, idx) => (
                    <Card key={idx}>
                        <CardContent className="p-4 flex gap-4">
                            <a href={item.image} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={item.image}
                                    alt="Product"
                                    className="w-24 h-24 object-cover rounded"
                                />
                            </a>
                            <div className="space-y-1 text-sm">
                                <p><strong>Quantity:</strong> {item.quantity}</p>
                                <p><strong>Price at Purchase:</strong> ${item.price_at_purchase.toFixed(2)}</p>
                                <p><strong>Original Price:</strong> ${item.price.toFixed(2)}</p>
                                <p><strong>Discount:</strong> {item.discount}%</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}