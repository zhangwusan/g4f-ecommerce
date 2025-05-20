export type CategoryProduct = {
  category: string;
  count: number;
};

export interface DisplayProductEachCategoriesResponse {
    title: string;
    description: string;
    data: CategoryProduct[];
    total: number;
}
