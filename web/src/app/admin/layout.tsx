import AdminLayoutClient from "@/components/layouts/admin-layout-client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}