'use client';

import BackButton from '@/components/ui/xbutton/back-btn';
import Button from '@/components/ui/xbutton/base';
import BaseInput from '@/components/ui/input-box';
import { useCart } from '@/context/cart';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  // Use the useEffect hook to load the cart on initial load
  useEffect(() => {
    if (cart.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [cart]);

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity > 0) {
      updateQuantity(id, quantity); // Update quantity both locally and on the server
    }
  };

  const handleRemoveItem = (id: number) => {
    removeFromCart(id); // Remove item both locally and on the server
  };

  const handleCheckout = () => {
    router.push('/cart/checkout')
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-4 flex justify-center">No Items</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <BackButton/>
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty 🛒</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  priority
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-500">${item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-black dark:text-white">
                <div className="flex items-center border rounded overflow-hidden border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                  <Button
                    type="button"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    default_style={false}
                  >
                    {"-"}
                  </Button>
                  <BaseInput
                    type="number"
                    min="1"
                    value={item.quantity}
                    default_style={false}
                    onChange={(e) =>
                      handleUpdateQuantity(item.id, parseInt(e.target.value))
                    }
                    className="w-12 text-center bg-transparent border-none focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                  <Button
                    type="button"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    default_style={false}
                  >
                    {"+"}
                  </Button>
                </div>

                <Button
                  onClick={() => handleRemoveItem(item.id)}
                  className="hover:bg-blue-700"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          <div className="text-right text-xl font-bold">
            Total: ${total.toFixed(2)}
          </div>

          <div className="text-right">
            <Button
              className="bg-black hover:bg-blue-700"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}