'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreateProductPayload, ProductManagementSetup, Value } from '@/lib/type/product.interface';
import { toast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import { fetchSetups, updateProduct, viewProduct } from '@/services/products/product.service';
import { originalApiBaseUrl } from '@/lib/constants/env';
import { ProductVariantTable } from '@/components/layouts/product-variant-table';
import { MultiImageUploader } from '@/components/layouts/multiple-uploader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SelectOrAddNew } from '@/components/layouts/select-or-add-new';
import { CreateCategoryPayload } from '@/lib/type/categories.interface';
import { addCategory } from '@/services/category.service';
import { CreateBrandPayload } from '@/lib/type/brand.interface';
import { addBrand } from '@/services/brand.service';
import { DimensionInput } from '@/components/layouts/dimension-input';
import { CreatableMultiSelect } from '@/components/layouts/creatable-multi-select';
import { CreateCareIngredientPayload } from '@/lib/type/care-instruction.interface';
import { addCareInstruction } from '@/services/case-instruction.service';
import { CreateUsageInstructionPayload } from '@/lib/type/usage-instruction.interface';
import { addUsageInstruction } from '@/services/usage-instruction.service';
import { CreateIngredientPayload } from '@/lib/type/ingredient.interface';
import { addIngredient } from '@/services/ingredient.service';
import { CreateTagPayload } from '@/lib/type/tag.interface';
import { addTag } from '@/services/tag.service';
import { CreateLabelProductPayload } from '@/lib/type/label.interface';
import { addLabel } from '@/services/label.service';
import { DatePicker } from '@/components/ui/datepicker';
import { Textarea } from '@headlessui/react';
import { resolveImageUrl } from '@/lib/xutils/image';
import { errorToast, successToast } from '@/components/layouts/toast';
import { BackButton } from '@/components/section/back-btn';

// Helper to convert URL to base64
async function imageUrlToBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export default function ProductUpdatePage() {
    const { id } = useParams();
    const productId = Number(id);

    const [setup, setSetup] = useState<ProductManagementSetup | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<CreateProductPayload>({
        product_name: '',
        slug: '',
        price: 0,
        discount: 0,
        description: '',
        short_description: '',
        manufacturing_date: undefined,
        expiry_date: undefined,
        return_policy: '',
        category_id: 0,
        brand_id: 0,
        dimension: {
            dimension_label: 'Standard Size',
            width: '0cm',
            height: '0cm',
            depth: '0cm',
            weight: '0g',
        },
        images: [],
        product_variants: [],
        tagIds: [],
        ingredientIds: [],
        careInstructionIds: [],
        usageInstructionIds: [],
        labelIds: [],
    });

    const handleChange = (field: keyof CreateProductPayload, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // Load setups and existing product data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [setupData, productData] = await Promise.all([
                    fetchSetups(),
                    viewProduct(productId),
                ]);
                setSetup(setupData);

                const base64Images = await Promise.all(
                    productData.images?.map(async (img: any) => {
                        const base64 = await imageUrlToBase64(resolveImageUrl(img.image_url, originalApiBaseUrl));
                        return base64;
                    }) || []
                );

                setForm({
                    product_name: productData.title,
                    slug: productData.slug,
                    price: productData.price,
                    discount: productData.discount,
                    description: productData.description,
                    short_description: productData.short_description,
                    manufacturing_date: productData.manufacturing_date ? new Date(productData.manufacturing_date) : undefined,
                    expiry_date: productData.expiry_date ? new Date(productData.expiry_date) : undefined,
                    return_policy: productData.return_policy || '',
                    category_id: productData.category_id || 0,
                    brand_id: productData.brand_id || 0,
                    dimension: {
                        dimension_label: productData.dimensions?.dimension_label || 'Standard Size',
                        width: productData.dimensions?.width || '0cm',
                        height: productData.dimensions?.height || '0cm',
                        depth: productData.dimensions?.depth || '0cm',
                        weight: productData.dimensions?.weight || '0g',
                    },
                    images: base64Images,
                    product_variants: productData.variants?.map((v: any) => ({
                        variant_id: v.variant_id,
                        color_id: v.color.id,
                        size_id: v.size.id,
                        price: v.price,
                        discount: v.discount,
                        stock: v.stock,
                        sku: v?.sku || '',
                        status_id: v.status_id,
                    })) || [],
                    tagIds: productData.tags?.map((t: any) => t.id) || [],
                    ingredientIds: productData.ingredients?.map((i: any) => i.id) || [],
                    careInstructionIds: productData.care_instructions?.map((c: any) => c.id) || [],
                    usageInstructionIds: productData.usage_instructions?.map((u: any) => u.id) || [],
                    labelIds: productData.labels?.map((l: any) => l.id) || [],
                });
            } catch (err: any) {
                setError(err.error || 'Failed to load product or setups');
            } finally {
                setLoading(false);
            }
        };

        if (!isNaN(productId)) {
            loadData();
        } else {
            setError('Invalid product ID');
        }
    }, [productId]);

    const handleSubmit = async () => {
        try {

            await updateProduct(productId, form);
            successToast('Product updated successfully')
        } catch (error: any) {
            console.error('Failed to update product:', error.message);
            errorToast( error.message || 'Failed to update product')
        }
    };

    useEffect(() => {
        console.log('form state changed:', form);
    }, [form]);

    if (loading) return <div className="p-6 text-center">Loading...</div>;
    if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;
    if (!setup) return null;

    return (
        <>
            <BackButton />
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6 text-center">Edit Product</h1>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-6"
                >
                    <div>
                        <Label htmlFor="product_name">Product Name</Label>
                        <Input
                            id="product_name"
                            value={form.product_name}
                            onChange={e => handleChange('product_name', e.target.value)}
                            placeholder="Product Name"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={form.slug}
                            onChange={e => handleChange('slug', e.target.value)}
                            placeholder="Slug"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            min={0}
                            step={0.01}
                            value={form.price}
                            onChange={e => handleChange('price', parseFloat(e.target.value))}
                            placeholder="Price"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input
                            id="discount"
                            type="number"
                            min={0}
                            max={100}
                            step={0.01}
                            value={form.discount}
                            onChange={e => handleChange('discount', parseFloat(e.target.value))}
                            placeholder="Discount"
                        />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <SelectOrAddNew
                            label="Category"
                            items={setup.categories}
                            valueKey="id"
                            labelKey="label"
                            value={form.category_id?.toString() || ''}
                            onChange={val => handleChange('category_id', Number(val))}
                            onCreate={async (formData) => {
                                const payload: CreateCategoryPayload = {
                                    category_name: formData.name,
                                    description: formData.description,
                                };

                                const data = await addCategory(payload);

                                const newCategory = {
                                    id: data.category_id,
                                    label: data.category_name,
                                };

                                setSetup(prev => {
                                    if (!prev) return prev;
                                    return {
                                        ...prev,
                                        categories: [...prev.categories, newCategory]
                                    }
                                });
                                return newCategory;
                            }}
                            fields={[
                                { name: 'name', label: 'Category Name', placeholder: 'Enter category name' },
                                { name: 'description', label: 'Description', placeholder: 'Optional description' }
                            ]}
                        />
                        <SelectOrAddNew
                            label="Brand"
                            items={setup.brands}
                            valueKey="id"
                            labelKey="label"
                            value={form.brand_id?.toString() || ''}
                            onChange={val => handleChange('brand_id', Number(val))}
                            onCreate={async (formData) => {
                                const payload: CreateBrandPayload = {
                                    brand_name: formData.name,
                                    description: formData.description,
                                };

                                const data = await addBrand(payload);

                                const newBrand = {
                                    id: data.brand_id,
                                    label: data.brand_name,
                                };

                                setSetup(prev => {
                                    if (!prev) return prev;
                                    return {
                                        ...prev,
                                        brands: [...prev.brands, newBrand]
                                    }
                                });
                                return newBrand;
                            }}
                            fields={[
                                { name: 'name', label: 'Brand Name', placeholder: 'Enter brand name' },
                                { name: 'description', label: 'Description', placeholder: 'Optional description' }
                            ]}
                        />
                    </div>

                    <DimensionInput value={form.dimension} onChange={(val) => handleChange('dimension', val)} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CreatableMultiSelect
                            label="Care Instructions"
                            options={setup?.care_instructions ?? []}
                            selected={
                                setup?.care_instructions.filter((ing) =>
                                    form.careInstructionIds.includes(ing.id)
                                ) ?? []
                            }
                            onChange={(newSelected) =>
                                handleChange('careInstructionIds', newSelected.map((opt) => opt.id))
                            }
                            placeholder="Choose your care instructions"
                            onCreate={async (label) => {
                                try {
                                    // Step 1: Call backend API to create the ingredient
                                    const payload: CreateCareIngredientPayload = {
                                        instruction: label
                                    }
                                    const data = await addCareInstruction(payload);

                                    const newInstruction = {
                                        id: data.id,
                                        label: data.instruction,
                                    }

                                    setSetup((prev) =>
                                        prev
                                            ? { ...prev, care_instructions: [...prev.care_instructions, newInstruction] }
                                            : prev
                                    );

                                    return newInstruction;
                                } catch (err) {
                                    console.error('Failed to create new care instructions:', err);
                                    return { id: 0, label: '' };
                                }
                            }}
                        />
                        <CreatableMultiSelect
                            label="Usage Instructions"
                            options={setup?.usage_instructions ?? []}
                            selected={
                                setup?.usage_instructions.filter((ing) =>
                                    form.usageInstructionIds.includes(ing.id)
                                ) ?? []
                            }
                            onChange={(newSelected) =>
                                handleChange('usageInstructionIds', newSelected.map((opt) => opt.id))
                            }
                            placeholder="Choose your usage instructions"
                            onCreate={async (label) => {
                                try {
                                    // Step 1: Call backend API to create the ingredient
                                    const payload: CreateUsageInstructionPayload = {
                                        instruction: label
                                    }
                                    const data = await addUsageInstruction(payload);

                                    const newInstruction = {
                                        id: data.id,
                                        label: data.instruction,
                                    }

                                    setSetup((prev) =>
                                        prev
                                            ? { ...prev, usage_instructions: [...prev.usage_instructions, newInstruction] }
                                            : prev
                                    );

                                    return newInstruction;
                                } catch (err) {
                                    console.error('Failed to create new usage instructions:', err);
                                    return { id: 0, label: '' };
                                }
                            }}
                        />
                        <CreatableMultiSelect
                            label="Ingredients"
                            options={setup?.ingredients ?? []}
                            selected={
                                setup?.ingredients.filter((ing) =>
                                    form.ingredientIds.includes(ing.id)
                                ) ?? []
                            }
                            onChange={(newSelected) =>
                                handleChange('ingredientIds', newSelected.map((opt) => opt.id))
                            }
                            placeholder="Choose your ingredients"
                            onCreate={async (label) => {
                                try {
                                    // Step 1: Call backend API to create the ingredient
                                    const payload: CreateIngredientPayload = {
                                        name: label
                                    }
                                    const data = await addIngredient(payload);

                                    const newIngredient = {
                                        id: data.ingredient_id,
                                        label: data.name,
                                    }

                                    // Step 2: Update local setup state to reflect the new option
                                    setSetup((prev) =>
                                        prev
                                            ? { ...prev, ingredients: [...prev.ingredients, newIngredient] }
                                            : prev
                                    );

                                    // Step 3: Return the newly created ingredient
                                    return newIngredient;
                                } catch (err) {
                                    console.error('Failed to create new ingredient:', err);
                                    return { id: 0, label: '' }; // fallback to avoid crashing the UI
                                }
                            }}
                        />
                        <CreatableMultiSelect
                            label="Tag"
                            options={setup?.product_tags ?? []}
                            selected={
                                setup?.product_tags.filter((ing) =>
                                    form.tagIds.includes(ing.id)
                                ) ?? []
                            }
                            onChange={(newSelected) =>
                                handleChange('tagIds', newSelected.map((opt) => opt.id))
                            }
                            placeholder="Choose your ingredients"
                            onCreate={async (label) => {
                                try {
                                    // Step 1: Call backend API to create the ingredient
                                    const payload: CreateTagPayload = {
                                        name: label
                                    }
                                    const data = await addTag(payload);

                                    const newTag = {
                                        id: data.ingredient_id,
                                        label: data.name,
                                    }

                                    // Step 2: Update local setup state to reflect the new option
                                    setSetup((prev) =>
                                        prev
                                            ? { ...prev, product_tags: [...prev.product_tags, newTag] }
                                            : prev
                                    );

                                    // Step 3: Return the newly created ingredient
                                    return newTag;
                                } catch (err) {
                                    console.error('Failed to create new tags:', err);
                                    return { id: 0, label: '' }; // fallback to avoid crashing the UI
                                }
                            }}
                        />

                        <CreatableMultiSelect
                            label="label product"
                            options={setup?.product_labels ?? []}
                            selected={
                                setup?.product_labels.filter((ing) =>
                                    form.labelIds.includes(ing.id)
                                ) ?? []
                            }
                            onChange={(newSelected) =>
                                handleChange('labelIds', newSelected.map((opt) => opt.id))
                            }
                            placeholder="Choose your labels"
                            onCreate={async (label) => {
                                try {
                                    // Step 1: Call backend API to create the ingredient
                                    const payload: CreateLabelProductPayload = {
                                        name: label
                                    }
                                    const data = await addLabel(payload);

                                    const newLabel = {
                                        id: data.ingredient_id,
                                        label: data.name,
                                    }

                                    // Step 2: Update local setup state to reflect the new option
                                    setSetup((prev) =>
                                        prev
                                            ? { ...prev, product_labels: [...prev.product_labels, newLabel] }
                                            : prev
                                    );

                                    // Step 3: Return the newly created ingredient
                                    return newLabel;
                                } catch (err) {
                                    console.error('Failed to create new label:', err);
                                    return { id: 0, label: '' }; // fallback to avoid crashing the UI
                                }
                            }}
                        />
                    </div>

                    <ProductVariantTable
                        colors={setup.colors}
                        sizes={setup.sizes}
                        statuses={setup.statuses}
                        value={form.product_variants}
                        onChange={(val) => handleChange('product_variants', val)}
                    />

                    <MultiImageUploader
                        value={form.images}
                        onChange={(val) => handleChange('images', val)}
                    />


                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="w-full p-2 border rounded-md"
                            value={form.description}
                            onChange={e => handleChange('description', e.target.value)}
                            placeholder="Description"
                            rows={4}
                        />
                    </div>

                    <div>
                        <Label htmlFor="short_description">Short Description</Label>
                        <Input
                            id="short_description"
                            value={form.short_description}
                            onChange={e => handleChange('short_description', e.target.value)}
                            placeholder="Short Description"
                        />
                    </div>


                    <DatePicker
                        label="Manufacturing Date"
                        date={form.manufacturing_date}
                        onChange={date => handleChange('manufacturing_date', date)}
                    />

                    <DatePicker
                        label="Expiry Date"
                        date={form.expiry_date}
                        onChange={date => handleChange('expiry_date', date)}
                    />


                    <div>
                        <Label htmlFor="return_policy">Return Policy</Label>
                        <Textarea
                            id="return_policy"
                            className="w-full p-2 border rounded-md"
                            value={form.return_policy}
                            onChange={e => handleChange('return_policy', e.target.value)}
                            placeholder="Return Policy"
                            rows={3}
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Update Product
                    </Button>
                </form>
            </div>
        </>

    );
}