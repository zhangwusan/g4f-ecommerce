export interface ProductDisplayResponse {
    id: number;
    title: string;
    price: number;
    discount: number;
    rating: number;
    rating_count: number;
    images: string[]
}

interface UserRating {
    user_id: number;
    username: string;
    avatar: string;
    rating: number;
    review: string;
    created_at: string;
}

interface Dimension {
    dimension_label: string;
    width: string;
    height: string;
    depth: string;
    weight: string;
}

interface Variant {
    variant_id: number;
    price: number;
    discount: number;
    color: {
        id: number;
        name: string;
    };
    size: {
        id: number;
        name: string;
    }
    status: string;
}

interface Image {
    id: number;
    image_url: string;
    is_main: boolean;
}

interface Tag {
    id: number;
    name: string;
}

interface CareInstruction {
    id: number;
    instruction: string;
}

interface UsageInstruction {
    id: number;
    instruction: string;
}

interface Ingredient {
    id: number;
    name: string;
}

        
export interface ProductResponse {
    id: number;
    title: string;
    slug: string;
    stock: number;
    rating: number;
    price: number;
    discount: number;
    rating_count: number;
    short_description: string;
    description: string;
    manufacturing_date: string;
    expiry_date: string;
    return_policy: string;

    brand_name: string;
    category: string;
    
    images: Image[];
    tags: Tag[];
    variants: Variant[];
    care_instructions: CareInstruction[];
    usage_instructions: UsageInstruction[];
    dimensions: Dimension;
    ingredients: Ingredient[];
}