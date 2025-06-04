import Brand from '@/app/models/brand/brand.model';
import Category from '@/app/models/category/category.model';
import CareInstruction from '@/app/models/product/care-instruction.model';
import Color from '@/app/models/product/color.model';
import ProductDimension from '@/app/models/product/dimension.model';
import ProductImage from '@/app/models/product/product-images.model';
import Ingredient from '@/app/models/product/ingredient.model';
import Label from '@/app/models/product/label.model';
import ProductRating from '@/app/models/product/product-rating.model';
import ProductVariantStatus from '@/app/models/product/product-variants-status.model';
import ProductVariant from '@/app/models/product/product-variants.model';
import Product from '@/app/models/product/product.model';
import Size from '@/app/models/product/size.model';
import Tag from '@/app/models/product/tag.model';
import UsageInstruction from '@/app/models/product/usage-instruction.model';
import { faker } from '@faker-js/faker';

function generateUniqueSet(generatorFn: () => string, count: number): string[] {
    const set = new Set<string>();
    while (set.size < count) {
        set.add(generatorFn());
    }
    return Array.from(set);
}

export class ProductGeneratorSeeder {
    public static async seed(productCount = 10) {
        try {
            // Unique brands
            const brandNames = generateUniqueSet(() => faker.company.name(), 5);
            await Brand.bulkCreate(brandNames.map(name => ({ brand_name: name })), { ignoreDuplicates: true });
            const brands = await Brand.findAll();

            // Unique categories (fixed set, already unique)
            const skinCategories = ['oily skin', 'dry skin', 'combination skin', 'sensitive skin', 'normal skin'];
            await Category.bulkCreate(skinCategories.map(name => ({ category_name: name })), { ignoreDuplicates: true });
            const categories = await Category.findAll();

            // Unique dimensions (make dimension_label unique)
            const dimensionLabels = generateUniqueSet(() => faker.commerce.productAdjective(), 5);
            await ProductDimension.bulkCreate(
                dimensionLabels.map(label => ({
                    dimension_label: label,
                    width: `${faker.number.int({ min: 5, max: 20 })}cm`,
                    height: `${faker.number.int({ min: 5, max: 20 })}cm`,
                    depth: `${faker.number.int({ min: 1, max: 10 })}cm`,
                    weight: `${faker.number.int({ min: 100, max: 1000 })}g`
                })),
                { ignoreDuplicates: true }
            );
            const dimensions = await ProductDimension.findAll();

            // Fixed sizes are unique by default
            const sizeLabels = ['S', 'M', 'L', 'XL', 'XXL'];
            await Size.bulkCreate(sizeLabels.map(name => ({ name })), { ignoreDuplicates: true });
            const sizes = await Size.findAll();

            // Unique colors
            const colorNames = generateUniqueSet(() => faker.color.human(), 5);
            await Color.bulkCreate(colorNames.map(name => ({ name })), { ignoreDuplicates: true });
            const colors = await Color.findAll();

            // Unique tags
            const tagNames = generateUniqueSet(() => faker.commerce.productAdjective(), 10);
            await Tag.bulkCreate(tagNames.map(name => ({ name })), { ignoreDuplicates: true });
            const tags = await Tag.findAll();

            // Unique ingredients
            const ingredientNames = generateUniqueSet(() => faker.science.chemicalElement().name, 10);
            await Ingredient.bulkCreate(ingredientNames.map(name => ({ name })), { ignoreDuplicates: true });
            const ingredients = await Ingredient.findAll();

            // Labels fixed and unique
            const labelNames = ['featured', 'best_seller', 'new_arrival'];
            await Label.bulkCreate(labelNames.map(name => ({ name })), { ignoreDuplicates: true });
            const labels = await Label.findAll();

            // Unique usage instructions
            const usageInstructionsTexts = generateUniqueSet(() => faker.lorem.sentence(), 5);
            await UsageInstruction.bulkCreate(usageInstructionsTexts.map(instruction => ({ instruction })));
            const usageInstructions = await UsageInstruction.findAll();

            // Unique care instructions
            const careInstructionsTexts = generateUniqueSet(() => faker.lorem.sentence(), 5);
            await CareInstruction.bulkCreate(careInstructionsTexts.map(instruction => ({ instruction })));
            const careInstructions = await CareInstruction.findAll();

            // Create Product variante status 
            await ProductVariantStatus.bulkCreate([
                { code: 'in_stock', label: 'In Stock' },
                { code: 'out_of_stock', label: 'Out of Stock' },
                { code: 'preorder', label: 'Pre-order' },
            ]);
            const product_variants_status = await ProductVariantStatus.findAll();

            // Create products with unique data
            for (let i = 0; i < productCount; i++) {
                const productName = faker.commerce.productName();
                const slug = faker.helpers.slugify(productName.toLowerCase());

                const product = await Product.create({
                    product_name: productName,
                    price: faker.number.float({ min: 10, max: 50, fractionDigits: 1 }),
                    discount: faker.number.int({ min: 0, max: 50 }),
                    slug,
                    description: faker.lorem.paragraph(),
                    short_description: faker.lorem.sentence(),
                    manufacturing_date: faker.date.past(),
                    expiry_date: faker.date.future(),
                    return_policy: faker.lorem.paragraph(),
                    brand_id: faker.helpers.arrayElement(brands).brand_id,
                    category_id: faker.helpers.arrayElement(categories).category_id,
                    dimension_id: faker.helpers.arrayElement(dimensions).id,
                    creator_id: 1,
                    updater_id: 1,
                });

                for (let v = 0; v < 3; v++) {
                    await ProductImage.create({
                        product_id: product.product_id,
                        image_url: '/public/images/avocado-optimized.jpg',
                        is_main: v === 0 ? true : false,
                    });
                }

                const usedCombos = new Set<string>();

                for (let v = 0; v < 2; v++) {
                    let unique = false;
                    let attempts = 0;

                    while (!unique && attempts < 10) {
                        const size = faker.helpers.arrayElement(sizes);
                        const color = faker.helpers.arrayElement(colors);
                        const comboKey = `${product.product_id}-${color.id}-${size.id}`;

                        if (!usedCombos.has(comboKey)) {
                            usedCombos.add(comboKey);
                            unique = true;

                            await ProductVariant.create({
                                product_id: product.product_id,
                                size_id: size.id,
                                color_id: color.id,
                                price: product.price,
                                discount: product.discount,
                                stock: faker.number.int({ min: 0, max: 50 }),
                                status_id: faker.helpers.arrayElement(product_variants_status).id,
                            });
                        }

                        attempts++;
                    }

                    if (!unique) {
                        console.warn(`Skipped duplicate variant for product ${product.product_id}`);
                    }
                }

                await product.$set('tags', faker.helpers.arrayElements(tags, 3));
                await product.$set('ingredients', faker.helpers.arrayElements(ingredients, 3));
                await product.$set('labels', faker.helpers.arrayElements(labels, 1));
                await product.$set('usage_instructions', faker.helpers.arrayElements(usageInstructions, 2));
                await product.$set('care_instructions', faker.helpers.arrayElements(careInstructions, 2));

                const totalUsers = 100; // total users in your system
                const minRatings = 5;   // minimum ratings to create
                const maxRatings = 100;  // maximum ratings to create

                // generate random number of ratings between min and max
                const ratingsCount = faker.number.int({ min: minRatings, max: maxRatings });

                for (let i = 0; i < ratingsCount; i++) {
                    // pick a random user id between 1 and totalUsers
                    const user_id = faker.number.int({ min: 1, max: totalUsers });

                    await ProductRating.create({
                        product_id: product.product_id,
                        user_id,
                        rating: faker.number.float({ min: 1.0, max: 5.0, fractionDigits: 1 }),
                        review: faker.lorem.sentences(2),
                    });
                }
            }

            console.log('\x1b[32mProducts and related data seeded successfully.');
        } catch (error) {
            console.error('\x1b[31mError seeding products:', error);
        }
    }
}