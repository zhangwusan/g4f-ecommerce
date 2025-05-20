import { en, Faker } from '@faker-js/faker';
import Product from '@/app/models/product/product.model';
import Color from '@/app/models/product/color.model';
import Size from '@/app/models/product/size.model';
import ProductTag from '@/app/models/product/product-tags.model';
import Brand from '@/app/models/brand/brand.model';
import Category from '@/app/models/category/category.model';
import Tag from '@/app/models/product/tag.model';
import ProductVariant from '@/app/models/product/product-variants.model';
import ProductImage from '@/app/models/product/images.model';

const faker = new Faker({ locale: [en] });

faker.location.language().name = 'en';

class ProductGenerator {
    public static async generateAndInsertMockProducts(count: number): Promise<void> {
        try {
            for (let i = 0; i < count; i++) {
                const mock = this.createMockProduct();

                const brandName = this.createMockBrand();
                const [brand] = await Brand.findOrCreate({
                    where: { brand_name: brandName },
                    defaults: { description: faker.company.catchPhrase() },
                });

                const categoryName = this.createMockCategories();
                const [category] = await Category.findOrCreate({
                    where: { category_name: categoryName },
                    defaults: { description: faker.commerce.productDescription() },
                });

                const basePrice = parseFloat(faker.commerce.price());
                const discount = faker.datatype.boolean() ? parseFloat(faker.commerce.price({ min: 1, max: 50 })) : 0;

                // Create Product
                const product = await Product.create({
                    product_name: mock.product_name,
                    slug: mock.slug + `-${i}`,
                    short_description: mock.short_description,
                    description: mock.description,
                    price: basePrice,
                    discount: discount,
                    skin_type: faker.helpers.arrayElement(['dry', 'oily', 'combination', 'sensitive']),
                    stock: faker.number.int({ min: 0, max: 500 }),
                    stock_quantity: faker.number.int({ min: 0, max: 500 }),
                    rating: faker.number.float({ min: 1, max: 5 }),
                    rating_count: faker.number.int({ min: 1, max: 1000 }),
                    availability_status: faker.helpers.arrayElement(['in_stock', 'out_of_stock', 'preorder']),
                    is_featured: mock.is_featured,
                    best_seller: mock.best_seller,
                    new_arrival: mock.new_arrival,
                    manufacturing_date: faker.date.past(),
                    expiry_date: faker.date.future(),
                    weight: (faker.number.float({ min: 5, max: 100 }) / 10).toFixed(2),
                    width: faker.number.float({ min: 5, max: 20 }).toString(),
                    height: faker.number.float({ min: 5, max: 20 }).toString(),
                    depth: faker.number.float({ min: 5, max: 20 }).toString(),
                    return_policy: faker.lorem.sentences(1),
                    meta_title: faker.commerce.productName(),
                    meta_description: faker.lorem.sentence(),
                    brand_id: brand.brand_id,
                    category_id: category.category_id,
                });

                const productId = product.product_id;

                // Insert and associate related data
                await Promise.all([
                    // Product Tags
                    ...mock.tags.map(name =>
                        Tag.findOrCreate({ where: { name } }).then(([tag]) =>
                            ProductTag.create({ product_id: productId, tag_id: tag.id })
                        )
                    ),

                    // Generate Product Variants for each combination of size and color
                    ...mock.colors.map(async (colorName) => {
                        const [color] = await Color.findOrCreate({ where: { name: colorName } });

                        return Promise.all(
                            mock.sizes.map(async (sizeName) => {
                                const [size] = await Size.findOrCreate({ where: { name: sizeName } });

                                return ProductVariant.create({
                                    product_id: productId,
                                    color_id: color.id,
                                    size_id: size.id,
                                    price: basePrice,
                                    discount: discount,
                                    stock: faker.number.int({ min: 0, max: 200 }),
                                    availability_status: faker.helpers.arrayElement(['in_stock', 'out_of_stock', 'preorder']),
                                });
                            })
                        );
                    }),

                    // Product Images (if any)
                    ...mock.images.map((image_url) =>
                        ProductImage.create({ product_id: productId, image_url: '/public/images/avocado-optimized.jpg' })
                    ),
                ]);
            }
        } catch (error) {
            console.error('Error generating mock products:', error);
            throw error;
        }
    }

    private static createMockProduct() {
        return {
            product_name: faker.commerce.productName(),
            slug: faker.helpers.slugify(faker.commerce.productName().toLowerCase()),
            short_description: faker.commerce.productDescription(),
            description: faker.lorem.paragraphs(2),
            is_featured: faker.datatype.boolean(),
            best_seller: faker.datatype.boolean(),
            new_arrival: faker.datatype.boolean(),
            tags: faker.helpers.arrayElements(['organic', 'vegan', 'eco', 'hydrating', 'anti-aging'], 2),
            colors: faker.helpers.arrayElements(['red', 'green', 'blue', 'white', 'black'], 2),
            sizes: faker.helpers.arrayElements(['S', 'M', 'L', 'XL'], 2),
            images: Array.from({ length: 3 }, () => faker.image.urlPicsumPhotos()),
        };
    }

    private static createMockCategories() {
        return faker.helpers.arrayElement([
            'Cleanser',
            'Toner',
            'Moisturizer',
            'Serum',
            'Essence',
            'Sunscreen',
            'Exfoliator',
            'Mask',
            'Eye Cream',
            'Face Oil',
            'Spot Treatment',
            'Facial Mist',
            'Night Cream',
            'BB Cream',
            'CC Cream',
        ]);
    }

    private static createMockBrand() {
        return faker.helpers.arrayElement([
            'GlowTheory',
            'DermaEssence',
            'SkinLab',
            'Lumière',
            'AquaPure',
            'NaturaSkin',
            'RadiantBloom',
            'SilkenTouch',
            'Elixir Organics',
            'Fresh Dew',
            'ClearAura',
            'BareGlow',
            'YouthNest',
            'Celestique',
            'Botaniq',
            'HydraRitual',
            'TrueSkin Co.',
            'Velveta',
            'Zenya Naturals',
            'NovaDerm',
        ]);
    }
}

export default ProductGenerator;