

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
} from 'sequelize-typescript';
import Product from '../product/product.model';
import Cart from './cart.model';
import Color from '../product/color.model';
import Size from '../product/size.model';
import ProductVariant from '../product/product-variants.model';

@Table({
    tableName: 'cart_items',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
})
class CartItem extends Model<CartItem> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER, field: 'cart_item_id' }) cart_item_id!: number;
    @Column({ type: DataType.INTEGER, allowNull: false, field: 'quantity' }) quantity!: number;
    @Column({ type: DataType.DECIMAL(5, 2), allowNull: false, field: 'discount' }) discount!: number;


    @ForeignKey(() => Cart) @Column({ type: DataType.INTEGER, allowNull: false, field: 'cart_id' }) cart_id!: number;
    // @ForeignKey(() => Product) @Column({ type: DataType.INTEGER, allowNull: false, field: 'product_id' }) product_id!: number;
    // @ForeignKey(() => Color) @Column({ type: DataType.INTEGER, allowNull: false, field: 'color_id' }) color_id!: number;
    // @ForeignKey(() => Size) @Column({ type: DataType.INTEGER, allowNull: false, field: 'size_id' }) size_id!: number;
    // @ForeignKey(() => ProductVariant)
    @Column({ type: DataType.INTEGER, allowNull: false, field: 'variant_id' })
    variant_id!: number;

    @BelongsTo(() => ProductVariant, { foreignKey: 'variant_id' })
    variant!: ProductVariant;

    // Associations
    @BelongsTo(() => Cart, { foreignKey: 'cart_id' }) cart!: Cart;
    // @BelongsTo(() => Product, { foreignKey: 'product_id' }) product!: Product;
    // @BelongsTo(() => Color, { foreignKey: 'color_id' }) color!: Color;
    // @BelongsTo(() => Size, { foreignKey: 'size_id' }) size!: Size;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}

export default CartItem;