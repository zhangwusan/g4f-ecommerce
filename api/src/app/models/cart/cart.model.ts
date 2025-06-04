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
import SocialUser from '../user/social-users.model';

@Table({
    tableName: 'cart',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
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
    
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}

export default Cart;