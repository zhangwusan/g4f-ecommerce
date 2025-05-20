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
import User from '../user/user.model';

@Table({
    tableName: 'orders',
    timestamps: true,
    paranoid: true,
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

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
        field: 'order_status',
    })
    order_status!: string;

    // Associations
    @BelongsTo(() => User, { foreignKey: 'user_id' })
    user!: User;

    // Timestamp
    @CreatedAt
    @Column({ field: 'created_at' })
    created_at!: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updated_at!: Date;
    @DeletedAt @Column({ field: 'deleted_at', }) deleted_at!: Date;
}

export default Order;