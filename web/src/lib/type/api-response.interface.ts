
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

export interface FetchUserParams {
  limit?: number;
  page?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, string | number>;
}

export interface BaseQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, string>;
  tags?: string[];
}