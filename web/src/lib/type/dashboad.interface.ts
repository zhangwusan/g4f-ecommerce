export interface TotalSaleResponse {
    title: string,
    growth: number,
    period: string,
    total_sale: number,
    order: number
}

export interface SalesResponse {
    title: string;
    description: string;
    data: {
        month: string;
        sales: number;
    }[];
    growth: number
}

export type TopSellingProduct = {
    product: string
    sales: number
}

export interface TopSellingProductsResponse {
    title: string;
    description: string;
    data: TopSellingProduct[]
}

export type CategoryProduct = {
  category: string;
  count: number;
};

export interface DisplayProductEachCategoriesResponse {
    title: string;
    description: string;
    data: CategoryProduct[]
    total: number;
}



export interface DashboardResponse {
    total_sale: TotalSaleResponse;
    sales: SalesResponse;
    top_selling: TopSellingProductsResponse;
    display_product_each_category: DisplayProductEachCategoriesResponse
}