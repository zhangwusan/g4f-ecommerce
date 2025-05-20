import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Product from './product.model';

@Table({
    tableName: 'product_images',
    timestamps: true,
    paranoid: true,
})
class ProductImage extends Model<ProductImage> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    image_id!: number;

    @Column({ type: DataType.STRING(255), allowNull: false, defaultValue: '/public/images/default-image.jpg' })
    image_url!: string;

    @ForeignKey(() => Product)
    @Column({ type: DataType.INTEGER, allowNull: false })
    product_id!: number;

    @BelongsTo(() => Product, { foreignKey: 'product_id' })
    product!: Product;
}

export default ProductImage;