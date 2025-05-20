
export type TopSellingProduct = {
    product: string
    sales: number
}

export interface TopSellingProductsResponse {
    title: string;
    description: string;
    data: TopSellingProduct[]
}