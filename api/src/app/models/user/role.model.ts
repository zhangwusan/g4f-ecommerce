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
})
class Role extends Model<Role> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER, allowNull: false, }) id!: number;
    @Column({ type: DataType.STRING(30), allowNull: false, unique: true, }) name!: string;
    @Column({ type: DataType.STRING, allowNull: true, }) description!: string;

    // Timestamp
    @CreatedAt @Column({ field: 'created_at' }) created_at!: Date;
    @UpdatedAt @Column({ field: 'updated_at' }) updated_at!: Date;

    // Association with User
    @HasMany(() => User)
    users?: User[];
}

export default Role;