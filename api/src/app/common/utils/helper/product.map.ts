import Product from "@/app/models/product/product.model";
import { ProductDisplayResponse, ProductResponse } from "../../interfaces/product.interface";

export function toProductDisplayResponse(product: Product): ProductDisplayResponse {
    return {
        id: +product.product_id,
        title: product.product_name,
        price: +product.price,
        discount: +product.discount,
        rating: +product.rating,
        images: product.images.map((image) => (image.image_url))
    }
}
export function toProductResponse(product: Product): ProductResponse {

    return {
        id: product.product_id,
        title: product.product_name,
        slug: product.slug,
        short_description: product.short_description,
        price: +product.price,
        discount: +product.discount,
        rating: product.rating ? +product.rating : 0,
        rating_count: product.rating_count ? product.rating_count : 0,
        images: product.images?.map(img => img.image_url) ?? [],
        category: product.category?.category_name ?? '',
        tags: product.tags?.map(tag => ({ id: tag.id, name: tag.name })) ?? [],
        description: product.description,
        colors: Array.from(new Map(
            product.variants?.map(v => v.color && { id: v.color.id, name: v.color.name })
                .filter(Boolean)
                .map(c => [c!.id, c!])
        ).values()) ?? [],

        sizes: Array.from(new Map(
            product.variants?.map(v => v.size && { id: v.size.id, name: v.size.name })
                .filter(Boolean)
                .map(s => [s!.id, s!])
        ).values()) ?? [],
        stock: +product.stock_quantity,
        availability_status: product.availability_status,
        brand: product.brand?.brand_name ?? '',
        ingredients: product.ingredients?.map(i => ({ id: i.id, name: i.name })) ?? [],
        manufacturing_date: product.manufacturing_date?.toISOString() ?? '',
        expiry_date: product.expiry_date?.toISOString() ?? '',
        weight: product.weight,
        dimensions: {
            width: product.width,
            height: product.height,
            depth: product.depth,
        },
        return_policy: product.return_policy,
        care_instructions: product.care_instructions?.map(i => ({ id: i.id, name: i.instruction })) ?? [],
        usage_instructions: product.usage_instructions?.map(i => ({ id: i.id, name: i.instruction })) ?? [],
        is_featured: product.is_featured,
        best_seller: product.best_seller,
        new_arrival: product.new_arrival,
        meta_title: product.meta_title,
        meta_description: product.meta_description,
    };
}