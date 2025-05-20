import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import Product from './product.model';
import ProductTag from './product-tags.model';

@Table({ tableName: 'tags', timestamps: true, paranoid: true })
class Tag extends Model<Tag> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string;

  @BelongsToMany(() => Product, () => ProductTag)
  products!: Product[];
}

export default Tag;