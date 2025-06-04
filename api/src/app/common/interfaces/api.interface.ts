
export interface Pagination {
    current_page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
}

export interface ApiResponse<T = any> {
    message: string;
    data?: T;
    error?: string;
    pagination?: Pagination;
}