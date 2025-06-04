import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import Order from '../order/order.model';

@Table({
  tableName: 'payments',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
class Payment extends Model<Payment> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    field: 'payment_id',
  })
  payment_id!: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'order_id',
  })
  order_id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'payment_method',
  })
  payment_method!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'transaction_id',
  })
  transaction_id!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: 'amount',
  })
  amount!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'payment_status',
  })
  payment_status!: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'payment_date',
    allowNull: false,
  })
  payment_date!: Date;

  // Associations
  @BelongsTo(() => Order, { foreignKey: 'order_id' })
  order!: Order;

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export default Payment;