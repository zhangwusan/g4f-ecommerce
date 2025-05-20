import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    ForeignKey,
    BelongsTo,
    DeletedAt,
    HasMany,
    BelongsToMany,
} from 'sequelize-typescript';
import Brand from '../brand/brand.model';
import Category from '../category/category.model';
import ProductImage from './images.model';
import ProductTag from './product-tags.model';
import Ingredient from './ingredient.model';
import ProductIngredient from './product-ingredient.model';
import CareInstruction from './care-instruction.model';
import ProductCareInstruction from './product-care-instruction.model';
import UsageInstruction from './usage-instruction.model';
import ProductUsageInstruction from './product-usage-instruction.model';
import Tag from './tag.model';
import ProductVariant from './product-variants.model';


@Table({
    tableName: 'products',
    timestamps: true,
    paranoid: true,
})
class Product extends Model<Product> {

    // Product Details
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    product_id!: number;

    @Column({ type: DataType.STRING(100), allowNull: false })
    product_name!: string;

    @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: '/public/images/default-image.jpg' })
    image_url!: string;

    @Column({ type: DataType.STRING(50), allowNull: true })
    skin_type!: string;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    stock_quantity!: number;

    @Column({ type: DataType.STRING(150), unique: true, allowNull: false })
    slug!: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    short_description!: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    description!: string;

    // Pricing
    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
    price!: number;

    @Column({ type: DataType.DECIMAL(5, 2), allowNull: false, defaultValue: 0 })
    discount!: number;


    // Ratings
    @Column({ type: DataType.DECIMAL(3, 2), allowNull: true })
    rating!: number;

    @Column({ type: DataType.INTEGER, allowNull: true })
    rating_count!: number;

    // Inventory
    @Column({ type: DataType.INTEGER, allowNull: false })
    stock!: number;

    @Column({
        type: DataType.ENUM('in_stock', 'out_of_stock', 'preorder'),
        allowNull: false,
        defaultValue: 'in_stock'
    })
    availability_status!: 'in_stock' | 'out_of_stock' | 'preorder';

    // Flags
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    is_featured!: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    best_seller!: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    new_arrival!: boolean;

    // Ingredients & Expiration
    @Column({ type: DataType.DATE, allowNull: true })
    manufacturing_date!: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    expiry_date!: Date;

    // Physical Attributes
    @Column({ type: DataType.STRING(50), allowNull: true })
    weight!: string;

    @Column({ type: DataType.STRING(50), allowNull: true })
    width!: string;

    @Column({ type: DataType.STRING(50), allowNull: true })
    height!: string;

    @Column({ type: DataType.STRING(50), allowNull: true })
    depth!: string;

    // Policies & Instructions
    @Column({ type: DataType.TEXT, allowNull: true })
    return_policy!: string;

    // SEO Fields
    @Column({ type: DataType.STRING(150), allowNull: true })
    meta_title!: string;

    @Column({ type: DataType.STRING(300), allowNull: true })
    meta_description!: string;

    // Foreign Keys
    @ForeignKey(() => Brand)
    @Column({ type: DataType.INTEGER, allowNull: true })
    brand_id!: number;

    @ForeignKey(() => Category)
    @Column({ type: DataType.INTEGER, allowNull: true })
    category_id!: number;

    // Associations
    @BelongsTo(() => Brand, { foreignKey: 'brand_id' })
    brand!: Brand;

    @BelongsTo(() => Category, { foreignKey: 'category_id' })
    category!: Category;

    @HasMany(() => ProductImage, { foreignKey: 'product_id' })
    images!: ProductImage[];

    @BelongsToMany(() => Tag, () => ProductTag)
    tags!: Tag[];

    @HasMany(() => ProductVariant, { foreignKey: 'product_id' })
    variants!: ProductVariant[];

    @BelongsToMany(() => Ingredient, () => ProductIngredient)
    ingredients!: Ingredient[];

    @BelongsToMany(() => CareInstruction, () => ProductCareInstruction)
    care_instructions!: CareInstruction[];

    @BelongsToMany(() => UsageInstruction, () => ProductUsageInstruction)
    usage_instructions!: UsageInstruction[];

    // Timestamps
    @CreatedAt
    @Column({ field: 'created_at' })
    created_at!: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updated_at!: Date;

    @DeletedAt @Column({ field: 'deleted_at', }) deleted_at!: Date;
}

export default Product;