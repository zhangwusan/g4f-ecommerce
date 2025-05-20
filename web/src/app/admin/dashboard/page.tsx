'use client';

import { ProductCategoryChart } from '@/components/layouts/dashboard/product-category';
import { SalesBarChart } from '@/components/layouts/dashboard/sales-bar-chart';
import { TopSellingProducts } from '@/components/layouts/dashboard/top-selling';
import { TotalSale } from '@/components/layouts/dashboard/total-sale';
import { DashboardResponse } from '@/lib/type/dashboad.interface';
import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardResponse>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        if (!res.ok) {
          throw new Error('Failed to load dashboard.');
        }
        const data: DashboardResponse = await res.json();
        setDashboard(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    console.log(dashboard)
  }, []);

  if (loading) return <div className="p-6 text-muted-foreground">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500 font-medium">Error: {error}</div>;
  if (!dashboard) return <div className="p-6 text-gray-500">No dashboard data available.</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TotalSale
          title={dashboard.total_sale.title}
          amount={dashboard.total_sale.total_sale}
          growth={dashboard.total_sale.growth}
          period={dashboard.total_sale.period}
          order={dashboard.total_sale.order}
        />

        <SalesBarChart
          title={dashboard.sales.title}
          description={dashboard.sales.description}
          data={dashboard.sales.data}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <TopSellingProducts
          title={dashboard.top_selling.title}
          description={dashboard.top_selling.description}
          data={dashboard.top_selling.data}
        />
        <ProductCategoryChart
          title={dashboard.display_product_each_category.title}
          data={dashboard.display_product_each_category.data}
          total={dashboard.display_product_each_category.total}
          description={dashboard.display_product_each_category.description}
        />
      </div>

      {/* You can add more sections below */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SalesBarChart title="Orders" ... />
        <SalesBarChart title="Refunds" ... />
      </div> */}
    </div>
  );
};

export default AdminDashboard;