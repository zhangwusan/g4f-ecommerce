import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    HasMany,
    DeletedAt,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import Product from '../product/product.model';
import User from '../user/user.model';

@Table({
    tableName: 'brands',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
})
class Brand extends Model<Brand> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: 'brand_id',
    })
    brand_id!: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
        field: 'brand_name',
    })
    brand_name!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description!: string;

    // Association: One brand has many products
    @HasMany(() => Product)
    products!: Product[];


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

    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}

export default Brand;