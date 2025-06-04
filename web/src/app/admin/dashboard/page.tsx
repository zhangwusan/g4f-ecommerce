'use client';

import { ProductCategoryChart } from '@/components/layouts/dashboard/product-category';
import RecentSales from '@/components/layouts/dashboard/recent-order';
import { SalesBarChart } from '@/components/layouts/dashboard/sales-bar-chart';
import ScoreCard from '@/components/layouts/dashboard/scorecard';
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
        setError(err.error || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-muted-foreground">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500 font-medium">Error: {error}</div>;
  if (!dashboard) return <div className="p-6 text-gray-500">No dashboard data available.</div>;

  return (
    <div className='space-y-6'>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ScoreCard title={dashboard.total_revenue.title} value={dashboard.total_revenue.amount} icon="DollarSign" className="h-full" />
          <ScoreCard title={dashboard.total_order.title} value={dashboard.total_order.value} icon="Package" className="h-full" />

          <div className="col-span-2 flex justify-center">
            <div className="w-full h-full">
              <ScoreCard title={dashboard.total_stock.title} value={dashboard.total_stock.total_stock} icon="Warehouse" className="h-full" />
            </div>
          </div>
        </div>
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
        <ProductCategoryChart
          title={dashboard.display_product_each_category.title}
          data={dashboard.display_product_each_category.data}
          total={dashboard.display_product_each_category.total}
          description={dashboard.display_product_each_category.description}
        />
        <RecentSales
          title={dashboard.recent_sale.title}
          description={dashboard.recent_sale.description}
          data={dashboard.recent_sale.data}
        />
      </div>


      <TopSellingProducts
        title={dashboard.top_selling.title}
        description={dashboard.top_selling.description}
        data={dashboard.top_selling.data}
      />

      {/* You can add more sections below */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SalesBarChart title="Orders" ... />
        <SalesBarChart title="Refunds" ... />
      </div> */}
    </div>
  );
};

export default AdminDashboard;