export interface ProductDisplayResponse {
    id: number;
    title: string;
    price: number;
    discount: number;
    rating: number;
    images: string[]
}

export interface ProductResponse {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    price: number;
    discount: number;
    rating: number;
    rating_count: number;
    images: string[];
    category: string;
    tags: {
        id: number;
        name: string;
    }[];
    description: string;
    colors: {
        id: number;
        name: string;
    }[];
    sizes: {
        id: number;
        name: string;
    }[];
    stock: number;
    availability_status: 'in_stock' | 'out_of_stock' | 'preorder';
    brand: string;
    ingredients: {
        id: number;
        name: string;
    }[];
    manufacturing_date: string; // ISO Date string
    expiry_date: string;        // ISO Date string
    weight: string;
    dimensions: ProductDimension;
    return_policy: string;
    care_instructions: {
        id: number;
        name: string;
    }[];
    usage_instructions: {
        id: number;
        name: string;
    }[];
    is_featured: boolean;
    best_seller: boolean;
    new_arrival: boolean;
    meta_title: string;
    meta_description: string;
}

export interface ProductDimension {
    width: string;
    height: string;
    depth: string;
}