import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';
import Product from './product.model';
import User from '../user/user.model';

@Table({
    tableName: 'product_images',
    timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
class ProductImage extends Model<ProductImage> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    image_id!: number;

    @Column({ type: DataType.STRING(255), allowNull: false, defaultValue: '/public/images/default-image.jpg' })
    image_url!: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    is_main: boolean;

    @ForeignKey(() => Product)
    @Column({ type: DataType.INTEGER, allowNull: false })
    product_id!: number;

    @BelongsTo(() => Product, { foreignKey: 'product_id' })
    product!: Product;


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

    @CreatedAt @Column({ field: 'created_at', }) created_at!: Date;
    @UpdatedAt @Column({ field: 'updated_at', }) updated_at!: Date;
    @DeletedAt @Column({ field: 'deleted_at', }) deleted_at!: Date;
}

export default ProductImage;