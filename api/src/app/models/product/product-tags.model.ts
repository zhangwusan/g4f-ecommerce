import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Product from './product.model';
import Tag from './tag.model';

@Table({ tableName: 'product_tags', timestamps: false })
class ProductTag extends Model<ProductTag> {
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER })
  product_id!: number;

  @ForeignKey(() => Tag)
  @Column({ type: DataType.INTEGER })
  tag_id!: number;
}

export default ProductTag;