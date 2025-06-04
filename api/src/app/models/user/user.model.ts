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
import SocialUser from './social-users.model';

@Table({
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
})
class User extends Model<User> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER, allowNull: false }) id!: number;
    @Column({ type: DataType.STRING(30), allowNull: false, }) first_name!: string;
    @Column({ type: DataType.STRING(30), allowNull: false, }) last_name!: string;
    @Column({ type: DataType.STRING(60), allowNull: false, }) username!: string;
    @Column({ type: DataType.STRING(100), allowNull: false, unique: true, }) email!: string;
    @Column({ type: DataType.STRING(15), allowNull: true, }) phone_number!: string;
    @Column({ type: DataType.STRING, allowNull: true, }) address!: string;
    @Column({ type: DataType.STRING, allowNull: true }) twoFactorSecret?: string;
    @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false }) isTwoFactorEnabled: boolean;
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: '/public/static/avatar.jpg' }) avatar!: string;
    @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true }) is_active!: boolean;
    @Column({
        type: DataType.STRING, allowNull: true, set(this: User, value: string | null) {
            if (typeof value === 'string' && value.length > 0) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(value, salt);
                this.setDataValue('password', hash);
            } else {
                this.setDataValue('password', null); // or undefined if you prefer
            }
        }
    }) password!: string;
    @Column({ type: DataType.TEXT, allowNull: true }) bio: string;

    // Foreign Key
    @ForeignKey(() => Role) @Column({ type: DataType.INTEGER, allowNull: false }) role_id!: number;
    // Associations
    @BelongsTo(() => Role, { foreignKey: 'role_id' })
    role!: Role;


    @HasOne(() => Cart, { foreignKey: 'user_id' })
    cart!: Cart;

    @HasMany(() => ProductRating) product_ratings!: ProductRating[];

    // Optional FK to SocialUser
    @ForeignKey(() => SocialUser) @Column({ type: DataType.INTEGER, allowNull: true }) social_user_id?: number;

    @BelongsTo(() => SocialUser) social_user?: SocialUser;

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

    // Method to check password
    public comparePassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }
}

export default User;