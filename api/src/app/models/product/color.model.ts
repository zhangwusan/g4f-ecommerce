import { Table, Column, Model, DataType, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from '../user/user.model';

@Table({
  tableName: 'colors',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
class Color extends Model<Color> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string;

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

export default Color;