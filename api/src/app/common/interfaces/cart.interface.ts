export interface CartItemResponse {
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