import {
    Table,
    Column,
    DataType,
    Model,
    PrimaryKey,
    AutoIncrement,
    CreatedAt,
    UpdatedAt,
    ForeignKey,
    DeletedAt,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript';
import User from '../user/user.model';
import CartItem from './cart-item.model';

@Table({
    tableName: 'cart',
    timestamps: true,
})
class Cart extends Model<Cart> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id!: number;

    // Relationship Cart item
    @BelongsTo(() => User, { foreignKey: 'user_id' })
    user!: User;

    @HasMany(() => CartItem, { foreignKey: 'cart_id' })
    cart_items!: CartItem[];
    // Timestamp
    @CreatedAt @Column({ field: 'created_at', }) created_at!: Date;
    @UpdatedAt @Column({ field: 'updated_at', }) updated_at!: Date;
    @DeletedAt @Column({ field: 'deleted_at', }) deleted_at!: Date;
}

export default Cart;