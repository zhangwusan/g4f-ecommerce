import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import Order from './order.model';
import Product from '../product/product.model';
  
  @Table({
    tableName: 'order_items',
    timestamps: false,  // No timestamps since the table doesn't mention created_at or updated_at
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
  
    @ForeignKey(() => Product)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      field: 'product_id',
    })
    product_id!: number;
  
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
  
    @BelongsTo(() => Product, { foreignKey: 'product_id' })
    product!: Product;
  }
  
  export default OrderItem;