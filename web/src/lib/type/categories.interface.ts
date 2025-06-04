import { ProductDisplayResponse } from "./product.interface";

export interface Category {
    category_id: number;
    category_name: string;
}

export interface SortOption {
    value: string;
    label: string;
}

export interface CategorySetupResponse {
    categories: Category[];
    sorts: SortOption[];
    order: SortOption[];
}


export interface CategoryWithProductsResponse {
    category_id: number;
    category_name: string;
    discription: string;
    created_at: string;
    updated_at: string;
    products: ProductDisplayResponse[];
}

export interface CreateCategoryPayload {
    category_name: string;
    description: string;
}