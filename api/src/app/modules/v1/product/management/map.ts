import Product from "@/app/models/product/product.model";

export function toProductManagementDisplayResponse(product: Product): ProductManagementDisplay {
    return {
        product_id: +product.product_id,
        product_name: product.product_name,
        price: +product.price,
        stock: +(product.getDataValue('stock_count') ?? 0),
        type: product.category.category_name ?? '',
        rating: +parseFloat((product.getDataValue('rating_avg') ?? 0).toString()).toFixed(1),
        rating_count: +(product.getDataValue('rating_count') ?? 0),
        expiry_date: product.expiry_date.toLocaleString(),
        images: product.images.map((image) => ({
            id: image.image_id,
            image_url: image.image_url,
            is_main: image.is_main
        })) ?? []
    }
}


export function toProductManagementDetailResponse(product: Product) {
    return {
        id: product.product_id,
        title: product.product_name,
        slug: product.slug,
        price: +product.price,
        discount: +product.discount,
        stock: +(product.getDataValue('stock_count') ?? 0),
        rating: +parseFloat((product.getDataValue('rating_avg') ?? 0).toString()).toFixed(1),
        rating_count: +(product.getDataValue('rating_count') ?? 0),
        short_description: product.short_description,
        description: product.description,
        manufacturing_date: product.manufacturing_date?.toISOString() ?? '',
        expiry_date: product.expiry_date?.toISOString() ?? '',
        return_policy: product.return_policy,

        brand_id: product.brand_id ?? 0,
        brand_name: product.brand?.brand_name ?? '',
        category_id: product?.category_id ?? 0,
        category: product.category?.category_name ?? '',

        images: product.images.map((img) => ({
            id: img.image_id,
            image_url: img.image_url,
            is_main: img.is_main,
        })) ?? [],

        tags: product.tags.map(t => ({
            id: t.id,
            name: t.name
        })) ?? [],

        variants: product.variants?.map(va => ({
            variant_id: +va.variant_id,
            price: +va.price,
            discount: +va.discount,
            stock: +va.stock,
            sku: va.sku,
            status_id: +va.status.id,
            color: {
                id: va.color.id,
                name: va.color.name,
            },
            size: {
                id: va.size.id,
                name: va.size.name,
            },
            status: va.status.label,
        })) ?? [],

        care_instructions: product.care_instructions?.map(ci => ({
            id: ci.id,
            instruction: ci.instruction
        })) ?? [],

        usage_instructions: product.usage_instructions?.map(ui => ({
            id: ui.id,
            instruction: ui.instruction
        })) ?? [],

        dimensions: product.dimension ? {
            dimension_label: product.dimension.dimension_label,
            width: product.dimension.width,
            height: product.dimension.height,
            depth: product.dimension.depth,
            weight: product.dimension.weight,
        } : {
            dimension_label: '',
            width: '',
            height: '',
            depth: '',
            weight: '',
        },

        ingredients: product.ingredients ?? [],
    };
}


