'use client';

import { useEffect, useState } from 'react';
import { PaymentDisplayHistory } from '@/lib/type/payment.interface';
import { fetchPaymentHistory, fetchPaymentPDF } from './service';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';
import MuiPagination from '@/components/layouts/pagination-section';
import { useRouter } from 'next/navigation';
import { previewBase64PDF } from '@/lib/xutils/pdf';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { BackButton } from '@/components/section/back-btn';

const PaymentHistoryPage = () => {
    const [payments, setPayments] = useState<PaymentDisplayHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    const router = useRouter();

    const loadPayments = async (currentPage: number) => {
        try {
            setLoading(true);
            const result = await fetchPaymentHistory(currentPage, limit);
            setPayments(result.data);
            setTotalPages(result.pagination.total_pages);
            setError(null);
        } catch (err: any) {
            setError(err.error || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayments(page);
    }, [page]);

    const handleViewPDF = async (id: string) => {
        try {
            const result = await fetchPaymentPDF(Number(id));
            await previewBase64PDF(result.data);

        } catch (err: any) {
            setError(err.error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 space-y-6 mx-auto">
            <div className='flex justify-between items-center'>
                <BackButton/>
                <h1 className="text-2xl font-semibold">Payment History</h1>
                <span></span>
            </div>

            <Card className="w-full">
                <CardContent className="p-4">
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : error ? (
                        <div className="flex items-start gap-2 text-red-600">
                            <AlertCircle className="w-5 h-5 mt-1" />
                            <div>
                                <p className="font-semibold">Error</p>
                                <p>{error}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-full overflow-x-auto">
                                <Table className="min-w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Transaction ID</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Address</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {payments.map((payment) => (
                                            <TableRow
                                                key={payment.transaction_id}
                                                onClick={() => router.push(`/auth/profile/payments/history/${payment.payment_id}`)}
                                                className="cursor-pointer"
                                            >
                                                <TableCell>{payment.transaction_id}</TableCell>
                                                <TableCell>{payment.payment_method}</TableCell>
                                                <TableCell>${payment.payment_amount.toFixed(2)}</TableCell>
                                                <TableCell>{payment.order_status}</TableCell>
                                                <TableCell>{payment.shipping_address}</TableCell>
                                                <TableCell>{new Date(payment.payment_date).toLocaleString()}</TableCell>

                                                {/* Action Buttons */}
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.push(`/auth/profile/payments/history/${payment.payment_id}`)
                                                                }
                                                            >
                                                                View
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleViewPDF(payment.payment_id)}
                                                            >
                                                                Preview PDF
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center mt-4">
                                <MuiPagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={(newPage) => setPage(newPage)}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentHistoryPage;