export interface AddCartItem {
    product_id: number;
    quantity: number;
    discount: number;
    discount_price: number;
    color: number;
    size: number;
}

export interface CartItem {
    id: number;
    variant_id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    discount: number;
    discount_price: number;
    color: string;
    size: string;
    date: Date
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: AddCartItem) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearCartAndUpdateProduct: () => Promise<void>;
  subtotal: number;
  shippingFee: number;
  total: number;
}