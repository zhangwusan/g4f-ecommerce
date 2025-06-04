export interface SaleItem {
  id: number;
  amount: number;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface RecentSalesResponse {
  title: string;
  description?: string;
  data: SaleItem[];
};