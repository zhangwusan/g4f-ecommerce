import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    HasMany,
} from 'sequelize-typescript';
import User from './user.model';

@Table({
    tableName: 'roles',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
})
class Role extends Model<Role> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER, allowNull: false, }) id!: number;
    @Column({ type: DataType.STRING(30), allowNull: false, unique: true, }) name!: string;
    @Column({ type: DataType.STRING, allowNull: true, }) description!: string;

    // Association with User
    @HasMany(() => User)
    users?: User[];

    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}

export default Role;