export interface ProductDisplayResponse {
    id: number;
    title: string;
    price: number;
    discount: number;
    rating: number;
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
    color: {
        id: number;
        name: string;
    };
    size: {
        id: number;
        name: string;
    }
    availability_status: string;
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


export interface ProductDetailResponse {
    id: number;
    title: string;
    slug: string;
    price: number;
    skin_type: string;
    discount: number;
    stock: number;
    rating: number;
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

export interface ProductManagementDisplay {
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

export interface Value {
    id: number,
    label: string;
}

export interface ProductManagementSetup {
    categories: Value[],
    brands: Value[],
    colors: Value[],
    sizes: Value[],
    statuses: Value[],
    product_labels: Value[],
    product_tags: Value[],
    ingredients: Value[],
    care_instructions: Value[],
    usage_instructions: Value[]
}

export interface ProductFormData {
    product_name: string;
    slug: string;
    price: number;
    discount: number;
    description?: string;
    short_description?: string;
    manufacturing_date?: Date;
    expiry_date?: Date;
    return_policy?: string;

    // relationship field
    category_id: number;
}


export interface DataEventResponse {
    top_rating: ProductDisplayResponse[],
    trending: ProductDisplayResponse[],
    recommended: ProductDisplayResponse[],
    best_deal: ProductDisplayResponse[],
    three_row_listing_product: ProductDisplayResponse[]
}

export interface ProductVariant {
    variant_id?: number;
    color_id: number;
    size_id: number;
    price: number;
    discount: number;
    stock: number;
    sku: string;
    status_id: number;
}

export interface CreateProductPayload {
    product_name: string;
    slug: string;
    price: number;
    discount: number;
    description: string;
    short_description: string;
    manufacturing_date: Date | undefined;
    expiry_date: Date | undefined;
    return_policy: string;
    brand_id: number;
    category_id: number;
    dimension: Dimension;
    images: string[];
    product_variants: ProductVariant[];
    tagIds: number[];
    ingredientIds: number[];
    careInstructionIds: number[];
    usageInstructionIds: number[];
    labelIds: number[]
}
