import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Product from "./product.model";
import User from "../user/user.model";

@Table({ 
  tableName: 'product_dimensions',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
class ProductDimension extends Model<ProductDimension> {
  @Column({ type: DataType.STRING(30), defaultValue: 'Standard Size' }) dimension_label!: string;
  @Column({ type: DataType.STRING(10), defaultValue: '0cm' })  width!: string;
  @Column({ type: DataType.STRING(10), defaultValue: '0cm' })  height!: string;
  @Column({ type: DataType.STRING(10), defaultValue: '0cm' })  depth!: string;
  @Column({ type: DataType.STRING(10), defaultValue: '0g' })   weight!: string;

  @HasMany(() => Product)
  products!: Product[];

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

export default ProductDimension;