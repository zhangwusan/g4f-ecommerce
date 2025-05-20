export interface AddCartItem {
    product_id: number;
    quantity: number;
    discount: number;
    color: number;
    size: number;
}

export interface CartItem {
    id: number;
    product_id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    discount: number;
    color: string;
    size: string;
    date: Date
}

export interface CartContextType {
    cart: CartItem[];
    addToCart: (item: AddCartItem) => Promise<void>;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    updateQuantity: (id: number, quantity: number) => void;
    fetchCart: () => Promise<void>; // 🆕 expose fetchCart
    clearCartAndUpdateProduct: () => void;
}