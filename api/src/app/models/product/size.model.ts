import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';

@Table({
  tableName: 'sizes',
  timestamps: true,
  paranoid: true,
})
class Size extends Model<Size> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string;
}

export default Size;