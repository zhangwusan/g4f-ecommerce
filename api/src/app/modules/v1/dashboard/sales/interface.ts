export type MonthlySalesData = {
  month: string;
  sales: number;
};

export interface SalesResponse {
    title: string;
    description: string;
    data: MonthlySalesData[];
}
