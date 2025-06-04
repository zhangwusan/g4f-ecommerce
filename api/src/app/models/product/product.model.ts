import { BelongsTo, BelongsToMany, Column, CreatedAt, DataType, DeletedAt, ForeignKey, HasMany, HasOne, Model, Table, UpdatedAt } from "sequelize-typescript";
import Brand from "../brand/brand.model";
import Category from "../category/category.model";
import ProductImage from "./product-images.model";
import ProductVariant from "./product-variants.model";
import Tag from "./tag.model";
import Ingredient from "./ingredient.model";
import CareInstruction from "./care-instruction.model";
import UsageInstruction from "./usage-instruction.model";
import ProductTag from "./product-tags.model";
import ProductIngredient from "./product-ingredient.model";
import ProductCareInstruction from "./product-care-instruction.model";
import ProductUsageInstruction from "./product-usage-instruction.model";
import User from "../user/user.model";
import Label from "./label.model";
import ProductLabel from "./product-label.model";
import ProductDimension from "./dimension.model";
import ProductRating from "./product-rating.model";

@Table({
    tableName: 'products',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
})
class Product extends Model<Product> {
    @Column({ primaryKey: true, autoIncrement: true }) product_id!: number;
    @Column({ allowNull: false }) product_name!: string;
    @Column({ allowNull: false }) slug!: string;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, defaultValue: 0 })
    price!: number;

    @Column({ type: DataType.DECIMAL(5, 2), allowNull: false, defaultValue: 0 })
    discount!: number;

    @Column(DataType.TEXT) description!: string;
    @Column(DataType.TEXT) short_description!: string;

    @Column(DataType.DATE) manufacturing_date!: Date;
    @Column(DataType.DATE) expiry_date!: Date;

    @Column(DataType.TEXT) return_policy!: string;

    // Foreign Keys
    @ForeignKey(() => Brand) @Column brand_id!: number;
    @ForeignKey(() => Category) @Column category_id!: number;
    @ForeignKey(() => ProductDimension) @Column dimension_id!: number;

    // Relationships
    @BelongsTo(() => Brand) brand!: Brand;
    @BelongsTo(() => Category, { foreignKey: 'category_id', as: 'category' }) category!: Category;
    @BelongsTo(() => ProductDimension) dimension!: ProductDimension;

    @HasMany(() => ProductImage, { as: 'images', foreignKey: 'product_id' }) images!: ProductImage[];
    @HasMany(() => ProductVariant) variants!: ProductVariant[];
    @HasMany(() => ProductRating, { as: 'ratings', foreignKey: 'product_id' }) ratings!: ProductRating[];
    @HasMany(() => ProductLabel) product_labels!: ProductLabel[];


    @BelongsToMany(() => Tag, () => ProductTag) tags!: Tag[];
    @BelongsToMany(() => Ingredient, () => ProductIngredient) ingredients!: Ingredient[];
    @BelongsToMany(() => CareInstruction, () => ProductCareInstruction) care_instructions!: CareInstruction[];
    @BelongsToMany(() => UsageInstruction, () => ProductUsageInstruction) usage_instructions!: UsageInstruction[];
    @BelongsToMany(() => Label, () => ProductLabel) labels!: Label[];

    // User Tracking
    @ForeignKey(() => User) @Column({ type: DataType.INTEGER, allowNull: true }) creator_id!: number;
    @ForeignKey(() => User) @Column({ type: DataType.INTEGER, allowNull: true }) updater_id!: number;
    @ForeignKey(() => User) @Column({ type: DataType.INTEGER, allowNull: true }) deleter_id!: number;

    @BelongsTo(() => User, { foreignKey: 'creator_id', as: 'creator' })
    @BelongsTo(() => User, { foreignKey: 'updater_id', as: 'updater' })
    @BelongsTo(() => User, { foreignKey: 'deleter_id', as: 'deleter' })

    creator!: User;
    updater!: User;
    deleter!: User;

    // Timestamps
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;

    // use to
    rating_avg: number;
    rating_count: number;
    stock_count: number;

}

export default Product;