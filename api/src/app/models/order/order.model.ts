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
    HasMany,
} from 'sequelize-typescript';
import User from '../user/user.model';
import OrderStatus from './order-status.model';
import OrderItem from './order-item.model';

@Table({
    tableName: 'orders',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
})
class Order extends Model<Order> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: 'order_id',
    })
    order_id!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'user_id',
    })
    user_id!: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'order_date',
    })
    order_date!: Date;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
        field: 'total_amount',
    })
    total_amount!: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        field: 'shipping_address',
    })
    shipping_address!: string;

    @ForeignKey(() => OrderStatus)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'order_status_id',
    })
    order_status_id!: number;

    @BelongsTo(() => OrderStatus)
    order_status!: OrderStatus;

    @HasMany(() => OrderItem)
    order_items!: OrderItem[];

    // Associations
    @BelongsTo(() => User, { foreignKey: 'user_id' })
    user!: User;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}

export default Order;