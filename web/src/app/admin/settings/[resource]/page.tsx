import AdminResourcePage from "./resource-admin";

export default async function Page({ params }: { params: { resource: string } }) {
    const { resource } = await params;
    return <AdminResourcePage resource={resource} />
}