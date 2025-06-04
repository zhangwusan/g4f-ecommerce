'use client';

import { useCart } from '@/context/cart';
import { useCheckout } from '@/context/checkout';
import Image from 'next/image';

export default function OrderPreview() {
    const { cart, subtotal, shippingFee, total } = useCart();
    const { billingInfo, shippingInfo } = useCheckout();

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">Order Preview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 shadow-lg rounded-xl p-8">
                {/* Left Column: Billing + Shipping Stacked */}
                <div className="space-y-6">
                    {/* Billing Info */}
                    <div className="p-5">
                        <h3 className="text-2xl font-semibold mb-2">Billing Information</h3>
                        <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Name:</span> {billingInfo?.fullName}</p>
                            <p><span className="font-medium">Email:</span> {billingInfo?.email}</p>
                            <p><span className="font-medium">Phone:</span> {billingInfo?.phone}</p>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="p-5">
                        <h3 className="text-2xl font-semibold mb-2">Shipping Address</h3>
                        <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Address:</span> {shippingInfo?.address}</p>
                            <p><span className="font-medium">City:</span> {shippingInfo?.city}</p>
                            <p><span className="font-medium">ZIP:</span> {shippingInfo?.zip}</p>
                            <p><span className="font-medium">Country:</span> {shippingInfo?.country}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Cart Items & Summary */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Items</h3>
                        <ul className="divide-y">
                            {cart.map((item) => (
                                <li key={item.id} className="flex justify-between items-center py-3">
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={56}
                                            height={56}
                                            className="rounded-lg border object-cover"
                                        />
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="font-semibold">
                                        ${(item.price * item.quantity * (1 - item.discount/100)).toFixed(2)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price Summary */}
                    <div className="border-t pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping:</span>
                            <span className="font-medium">${shippingFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold pt-2 border-t">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}