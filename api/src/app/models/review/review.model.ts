import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    CreatedAt,
    UpdatedAt,
    BelongsTo,
} from 'sequelize-typescript';
import Product from '../product/product.model';
import User from '../user/user.model';

@Table({
    tableName: 'reviews',
    timestamps: true,  // Assuming created_at and updated_at will be automatically managed
})
class Review extends Model<Review> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: 'review_id',
    })
    review_id!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'rating',
    })
    rating!: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
        field: 'comment',
    })
    comment!: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        field: 'created_at',
        allowNull: false,
    })
    created_at!: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        field: 'updated_at',
        allowNull: false,
    })
    updated_at!: Date;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'product_id',
    })
    product_id!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'user_id',
    })
    user_id!: number;

    // Associations
    @BelongsTo(() => Product, { foreignKey: 'product_id' })
    product!: Product;

    @BelongsTo(() => User, { foreignKey: 'user_id' })
    user!: User;

    
}

export default Review;