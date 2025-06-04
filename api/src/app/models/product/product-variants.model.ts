import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import Product from './product.model';
import Color from './color.model';
import Size from './size.model';
import ProductVariantStatus from './product-variants-status.model';
import User from '../user/user.model';

@Table({
    tableName: 'product_variants',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    indexes: [
        {
            unique: true,
            fields: ['product_id', 'color_id', 'size_id'],
        },
    ],
})
class ProductVariant extends Model<ProductVariant> {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    variant_id!: number;

    @ForeignKey(() => Product)
    @Column({ type: DataType.INTEGER, allowNull: false })
    product_id!: number;

    @ForeignKey(() => Color)
    @Column({ type: DataType.INTEGER, allowNull: false })
    color_id!: number;

    @ForeignKey(() => Size)
    @Column({ type: DataType.INTEGER, allowNull: false })
    size_id!: number;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, defaultValue: 0 })
    price!: number;

    @Column({ type: DataType.DECIMAL(5, 2), allowNull: false, defaultValue: 0 })
    discount!: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    stock!: number;

    @Column({ type: DataType.STRING, allowNull: true, unique: true })
    sku?: string;

    @BelongsTo(() => Product, { foreignKey: 'product_id' })
    product!: Product;

    @BelongsTo(() => Color, { foreignKey: 'color_id' })
    color!: Color;

    @BelongsTo(() => Size, { foreignKey: 'size_id' })
    size!: Size;

    @ForeignKey(() => ProductVariantStatus)
    @Column({ type: DataType.INTEGER, allowNull: false })
    status_id!: number;

    @BelongsTo(() => ProductVariantStatus, { foreignKey: 'status_id' })
    status!: ProductVariantStatus;


    // Soft delete and User tracking
    @ForeignKey(() => User) @Column({ type: DataType.INTEGER, allowNull: true }) creator_id!: number;
    @ForeignKey(() => User) @Column({ type: DataType.INTEGER, allowNull: true }) updater_id!: number;
    @ForeignKey(() => User) @Column({ type: DataType.INTEGER, allowNull: true }) deleter_id!: number;

    @BelongsTo(() => User, { foreignKey: 'creator_id', as: 'creator' })
    @BelongsTo(() => User, { foreignKey: 'updater_id', as: 'updater' })
    @BelongsTo(() => User, { foreignKey: 'deleter_id', as: 'deleter' })

    creator!: User;
    updater!: User;
    deleter!: User;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date;

}

export default ProductVariant;