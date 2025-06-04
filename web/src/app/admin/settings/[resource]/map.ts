export const mapRouteResource: Record<
    string,
    {
        title: string;
        columns: string[];
        apiEndpoint: string;
    }
> = {
    brands: {
        title: 'Manage Brands',
        columns: ['id', 'name', 'created_at', 'updated_at'],
        apiEndpoint: '/api/admin/products/brands'
    },
    categories: {
        title: 'Manage Categories',
        columns: ['id', 'name', 'created_at', 'updated_at'],
        apiEndpoint: '/api/admin/products/categories'
    },
    colors: {
        title: 'Manage Colors',
        columns: ['id', 'name', 'created_at', 'updated_at'],
        apiEndpoint: '/api/admin/products/colors',
    },
    sizes: {
        title: 'Manage Sizes',
        columns: ['id', 'name', 'created_at', 'updated_at'],
        apiEndpoint: '/api/admin/products/sizes',
    },
    tags: {
        title: 'Manage Tags',
        columns: ['id', 'name', 'created_at', 'updated_at'],
        apiEndpoint: '/api/admin/products/tags',
    },
    labels: {
        title: 'Manage Label Product',
        columns: ['id', 'name', 'created_at', 'updated_at'],
        apiEndpoint: '/api/admin/products/labels',
    },
    ingredients: {
        title: 'Manage Ingredient Product',
        columns: ['id', 'name', 'created_at', 'updated_at'],
        apiEndpoint: '/api/admin/products/ingredients',
    },
    'care-instructions': {
        title: 'Care Instructions',
        columns: ['id', 'name', 'created_at', 'updated_at'],
        apiEndpoint: '/api/admin/products/care-instructions',
    },
    'usage-instructions': {
        title: 'Usage Instructions',
        columns: ['id', 'name', 'created_at', 'updated_at'],
        apiEndpoint: '/api/admin/products/usage-instructions',
    },
};