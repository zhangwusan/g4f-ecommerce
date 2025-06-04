interface ProductManagementDisplay {
    product_id: number;
    product_name: string;
    price: number;
    stock: number;
    type: string;
    rating: number;
    rating_count: number;
    expiry_date: string;
    images: {
        id: number,
        image_url: string;
        is_main: boolean
    }[]
}