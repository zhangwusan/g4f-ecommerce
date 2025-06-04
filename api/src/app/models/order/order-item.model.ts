import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Order from './order.model';
import ProductVariant from '../product/product-variants.model';

@Table({
  tableName: 'order_items',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
class OrderItem extends Model<OrderItem> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    field: 'order_item_id',
  })
  order_item_id!: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'order_id',
  })
  order_id!: number;

  @ForeignKey(() => ProductVariant)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'variant_id' })
  variant_id!: number;

  @BelongsTo(() => ProductVariant, { foreignKey: 'variant_id' })
  variant!: ProductVariant;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'quantity',
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: 'price_at_purchase',
  })
  price_at_purchase!: number;

  // Associations
  @BelongsTo(() => Order, { foreignKey: 'order_id' })
  order!: Order;

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export default OrderItem;