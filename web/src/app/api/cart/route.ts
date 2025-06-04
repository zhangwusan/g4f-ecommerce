import { NextRequest, NextResponse } from 'next/server';
import { apiBaseUrlV1, originalApiBaseUrl } from '@/lib/constants/env';
import { fetchWithToken } from '@/lib/fetch/fetch-with-token';
import { CartItem } from '@/lib/type/cart.interface';
import { resolveImageUrl } from '@/lib/xutils/image';


// Add to Cart
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, discount, quantity, color, size } = body;

    const response = await fetchWithToken(`${apiBaseUrlV1}/carts/user-cart`, { 
      method: 'POST',
      body: JSON.stringify({
        product_id,
        discount,
        quantity,
        color,
        size,
      }),
    });

    if(!response.ok) {
      const error = await response.json();
      console.log("Failed to Add cart: ", error);
      return NextResponse.json({ message: error.message || 'Failed to Add cart'})
    }

    const { message } = await response.json();
    console.log(message)
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error ', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}

// Get Cart
export async function GET(req: NextRequest) {
  try {
    const response = await fetchWithToken(`${apiBaseUrlV1}/carts/user-cart`, { method: 'GET' });
    
    if (!response.ok) {
      const error = await response.json()
      console.log("Error request : ", error)
      return NextResponse.json({ message: error?.message || 'Failed to remove item from cart' }, { status: response.status });

    }
    const { data } = await response.json();

    return NextResponse.json(data.map((item : CartItem) => ({
      ...item,
      image: item.image ? resolveImageUrl(item.image, originalApiBaseUrl) : '',
    })), { status: 200 });
  } catch (error) {
    console.error('Error GET :', error);
    return NextResponse.json([], { status: 200 });
  }
}

// Remove from Cart
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'Invalid item id' }, { status: 400 });
    }

    // fetch api
    const url = new URL(`${apiBaseUrlV1}/carts/user-cart/${id}`);

    const response = await fetchWithToken(url.toString(), { method: 'DELETE' });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('API error:', errorResponse);
      return NextResponse.json({ message: errorResponse?.message || 'Failed to remove item from cart' }, { status: response.status });
    }
    const { message } = await response.json();

    return NextResponse.json({ message: message });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}

// Update Quantity in Cart
export async function PATCH(req: NextRequest) {
  try {
    const { id, quantity } = await req.json();

    if (!id || quantity <= 0) {
      return NextResponse.json({ message: 'Invalid item id or quantity' }, { status: 400 });
    }

    const url = new URL(`${apiBaseUrlV1}/carts/user-cart/${id}`);
    url.searchParams.set('quantity', quantity.toString());
    // fetch api
    const response = await fetchWithToken(url.toString(), { method: 'PATCH' })

    console.log('response', await response.json());

    return NextResponse.json({ message: 'Cart updated' });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}