import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';

@Table({
  tableName: 'colors',
  timestamps: true,
  paranoid: true,
})
class Color extends Model<Color> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string;
}

export default Color;