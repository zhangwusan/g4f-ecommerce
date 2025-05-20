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

@Table({
    tableName: 'product_variants',
    timestamps: true,
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

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
    price!: number;

    @Column({ type: DataType.DECIMAL(5, 2), allowNull: false, defaultValue: 0 })
    discount!: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    stock!: number;

    @Column({
        type: DataType.ENUM('in_stock', 'out_of_stock', 'preorder'),
        allowNull: false,
        defaultValue: 'in_stock'
    })
    availability_status!: 'in_stock' | 'out_of_stock' | 'preorder';

    @BelongsTo(() => Product, { foreignKey: 'product_id' })
    product!: Product;

    @BelongsTo(() => Color, { foreignKey: 'color_id' })
    color!: Color;

    @BelongsTo(() => Size, { foreignKey: 'size_id' })
    size!: Size;

}

export default ProductVariant;