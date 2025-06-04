import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    BelongsTo,
    ForeignKey,
    DeletedAt,
    HasOne,
    HasMany,
} from 'sequelize-typescript';
import Role from './role.model';
import * as bcrypt from 'bcryptjs';
import Cart from '../cart/cart.model';
import ProductRating from '../product/product-rating.model';
import User from './user.model';

@Table({
    tableName: 'social_users',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
})
class SocialUser extends Model<SocialUser> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER, allowNull: false }) id!: number;
    @Column(DataType.STRING) provider: string; // 'google', 'github', etc.
    @Column(DataType.STRING) provider_id: string; // the unique OAuth `sub` or ID

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


    // Timestamp
    @CreatedAt @Column({ field: 'created_at', }) created_at!: Date;
    @UpdatedAt @Column({ field: 'updated_at', }) updated_at!: Date;
    @DeletedAt @Column({ field: 'deleted_at', }) deleted_at!: Date;
}

export default SocialUser;