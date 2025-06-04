// scrap-data.seed.ts
import { RoleEnum } from '@/app/common/utils/enum/role.enum';
import Brand from '@/app/models/brand/brand.model';
import Category from '@/app/models/category/category.model';
import CareInstruction from '@/app/models/product/care-instruction.model';
import Color from '@/app/models/product/color.model';
import ProductDimension from '@/app/models/product/dimension.model';
import Ingredient from '@/app/models/product/ingredient.model';
import Label from '@/app/models/product/label.model';
import ProductImage from '@/app/models/product/product-images.model';
import ProductRating from '@/app/models/product/product-rating.model';
import ProductVariantStatus from '@/app/models/product/product-variants-status.model';
import ProductVariant from '@/app/models/product/product-variants.model';
import Product from '@/app/models/product/product.model';
import Size from '@/app/models/product/size.model';
import Tag from '@/app/models/product/tag.model';
import UsageInstruction from '@/app/models/product/usage-instruction.model';
import User from '@/app/models/user/user.model';
import { faker } from '@faker-js/faker';
import * as fs from 'fs/promises';
import * as path from 'path';

export type ProductImageJSON = { url: string };
export type ProductNotification = { title: string; content: string };
export type ProductReview = {
    stars: string;
    title: string;
    email: string;
    content: string;
    date: string;
    images?: string[];
};
export type ProductJson = {
    code: string;
    weight: string;
    product_name: string;
    brand: string;
    brand_url: string;
    price: number;
    discount: number;
    discount_price: number;
    images: ProductImageJSON[];
    notifications: ProductNotification[];
    description: string;
    extra_description: string;
    instruction_image: string;
    shipping_info: string;
    reviews: ProductReview[];
    original_name: string;
    original_url: string;
    category: string;
    subcategory: string;
};

function generateUniqueSet(generatorFn: () => string, count: number): string[] {
    const set = new Set<string>();
    while (set.size < count) {
        set.add(generatorFn());
    }
    return Array.from(set);
}

export class ScrapData {
    public static seed = async () => {
        try {
            await this.seedProducts();
            console.log('\x1b[32mData seeded successfully.');
        } catch (error) {
            console.error('\x1b[31mError seeding data Products:', error);
        }
    };

    private static async seedProducts() {
        const dimension = await ProductDimension.findOne() ?? await ProductDimension.create();
        const [variant_status] = await ProductVariantStatus.findOrCreate({
            where: { code: 'in_stock' },
            defaults: { code: 'in_stock', label: 'In Stock' }
        });

        const sizeLabels = ['S', 'M', 'L', 'XL', 'XXL'];
        await Size.bulkCreate(sizeLabels.map(name => ({ name })), { ignoreDuplicates: true });
        const sizes = await Size.findAll();

        const colorNames = generateUniqueSet(() => faker.color.human(), 5);
        await Color.bulkCreate(colorNames.map(name => ({ name })), { ignoreDuplicates: true });
        const colors = await Color.findAll();

        const tagNames = generateUniqueSet(() => faker.commerce.productAdjective(), 10);
        await Tag.bulkCreate(tagNames.map(name => ({ name })), { ignoreDuplicates: true });
        const tags = await Tag.findAll();

        const ingredientNames = generateUniqueSet(() => faker.science.chemicalElement().name, 10);
        await Ingredient.bulkCreate(ingredientNames.map(name => ({ name })), { ignoreDuplicates: true });
        const ingredients = await Ingredient.findAll();

        const labelNames = ['featured', 'best_seller', 'new_arrival'];
        await Label.bulkCreate(labelNames.map(name => ({ name })), { ignoreDuplicates: true });
        const labels = await Label.findAll();

        const usageInstructionsTexts = generateUniqueSet(() => faker.lorem.sentence(), 5);
        await UsageInstruction.bulkCreate(usageInstructionsTexts.map(instruction => ({ instruction })), { ignoreDuplicates: true });
        const usageInstructions = await UsageInstruction.findAll();

        const careInstructionsTexts = generateUniqueSet(() => faker.lorem.sentence(), 5);
        await CareInstruction.bulkCreate(careInstructionsTexts.map(instruction => ({ instruction })), { ignoreDuplicates: true });
        const careInstructions = await CareInstruction.findAll();

        const subfolders = await this.getSubFolder();

        for (const subfolder of subfolders) {
            for (const filePath of subfolder.files) {
                try {
                    const pathname = path.join(subfolder.path, filePath);
                    const productsjson: ProductJson[] = await this.readJsonFile(pathname);

                    for (const pro of productsjson) {
                        const brand = await this.getBrand(pro.brand, pro.brand_url);
                        const category = await this.getCategory(pro.category, pro.subcategory);

                        const [product, created] = await Product.findOrCreate({
                            where: { slug: pro.code },
                            defaults: {
                                product_name: pro.product_name,
                                slug: pro.code ?? faker.string.uuid(),
                                price: pro.price,
                                discount: pro.discount,
                                description: pro.description,
                                short_description: pro.extra_description,
                                manufacturing_date: new Date(),
                                expiry_date: new Date(),
                                return_policy: "Items can be returned within 30 days...",
                                dimension_id: dimension.id,
                                brand_id: brand.brand_id,
                                category_id: category.category_id,
                                creator_id: RoleEnum.ADMIN
                            }
                        });

                        if (!created) continue;

                        for (const [index, img] of pro.images.entries()) {
                            await ProductImage.create({
                                image_url: img.url,
                                is_main: index === 0,
                                product_id: product.product_id,
                                creator_id: RoleEnum.ADMIN
                            });
                        }

                        const size = faker.helpers.arrayElement(sizes);
                        const color = faker.helpers.arrayElement(colors);

                        await ProductVariant.create({
                            product_id: product.product_id,
                            color_id: color.id,
                            size_id: size.id,
                            price: product.price,
                            discount: product.discount,
                            stock: faker.number.int({ min: 0, max: 50 }),
                            status_id: variant_status.id,
                            creator_id: RoleEnum.ADMIN
                        });

                        if (pro.reviews?.length) {
                            for (const [index, review] of pro.reviews.entries()) {
                                const [user] = await User.findOrCreate({
                                    where: { email: review.email },
                                    defaults: {
                                        first_name: this.getNameFormEmail(review.email),
                                        last_name: this.getNameFormEmail(review.email),
                                        username: this.getNameFormEmail(review.email),
                                        email: review.email,
                                        phone_number: this.generatePhoneNumber(index),
                                        role_id: RoleEnum.USER,
                                        password: '12345678',
                                        creator_id: RoleEnum.ADMIN
                                    }
                                });

                                // Validate and parse the review date
                                let createdAt = new Date(review.date);
                                if (isNaN(createdAt.getTime())) {
                                    // If date is invalid, fallback to current date
                                    createdAt = new Date();
                                }

                                await ProductRating.create({
                                    product_id: product.product_id,
                                    user_id: user.id,
                                    rating: +review.stars || 0,
                                    review: review.content ?? '',
                                    created_at: createdAt,
                                    image: review.images?.[0] ?? '',
                                    title: review.title
                                });
                            }
                        }

                        await product.$set('tags', faker.helpers.arrayElements(tags, 3));
                        await product.$set('ingredients', faker.helpers.arrayElements(ingredients, 3));
                        await product.$set('labels', faker.helpers.arrayElements(labels, 1));
                        await product.$set('usage_instructions', faker.helpers.arrayElements(usageInstructions, 2));
                        await product.$set('care_instructions', faker.helpers.arrayElements(careInstructions, 2));
                    }
                } catch (err) {
                    console.error(`[ERROR] File: ${filePath}`, err);
                }
            }
        }

        console.log('\x1b[32mProducts inserted without cleaning.');
    }

    private static async getSubFolder() {
        const currentRoot = path.resolve(__dirname);
        const dataDir = path.join(currentRoot, '..', '..', '..', '..', 'stylekorean', 'data', 'product_details');
        const entries = await fs.readdir(dataDir, { withFileTypes: true });

        const folders = entries.filter(entry => entry.isDirectory()).map(dir => dir.name);
        return Promise.all(folders.map(async folder => {
            const folderPath = path.join(dataDir, folder);
            const folderEntries = await fs.readdir(folderPath, { withFileTypes: true });
            const filenames = folderEntries.filter(fileEntry => fileEntry.isFile()).map(fileEntry => fileEntry.name);
            return { path: folderPath, foldername: folder, files: filenames };
        }));
    }

    private static async getBrand(name: string, url: string) {
        const [brand] = await Brand.findOrCreate({
            where: { brand_name: name },
            defaults: { brand_name: name, description: url }
        });
        return brand;
    }

    private static async getCategory(name: string, url: string) {
        const [category] = await Category.findOrCreate({
            where: { category_name: name },
            defaults: { category_name: name, description: url }
        });
        return category;
    }

    private static getNameFormEmail(email: string) {
        return email.split('@')[0];
    }

    private static generatePhoneNumber(index: number): string {
        const isElevenDigits = Math.random() < 0.5;
        const prefix = isElevenDigits ? '010' : '01';
        const remainingLength = isElevenDigits ? 8 : 9;
        const remaining = Array.from({ length: remainingLength }, () =>
            Math.floor(Math.random() * 10)
        ).join('');
        return `${prefix}${remaining}`;
    }

    private static async readJsonFile(filePath: string): Promise<ProductJson[]> {
        const fileContents = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContents) as ProductJson[];
    }
}