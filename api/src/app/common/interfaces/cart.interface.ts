export interface CartItemResponse {
    id: number;
    variant_id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    discount_price: number;
    discount: number;
    color: string;
    size: string;
    date: Date
}