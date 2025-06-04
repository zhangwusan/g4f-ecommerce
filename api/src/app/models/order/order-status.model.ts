import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Order from './order.model';

@Table({
    tableName: 'order_statuses',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
})
class OrderStatus extends Model<OrderStatus> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: 'id',
    })
    id!: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
        unique: true,
    })
    name!: string;

    @HasMany(() => Order)
    orders!: Order[];

    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}

export default OrderStatus;