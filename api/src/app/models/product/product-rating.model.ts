import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import Product from "./product.model";
import User from "../user/user.model";
import SocialUser from "../user/social-users.model";

@Table({
  tableName: 'product_ratings',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
class ProductRating extends Model<ProductRating> {
  @ForeignKey(() => Product)
  @Column
  product_id!: number;

  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @Column({ type: DataType.DECIMAL(2, 1), allowNull: false })
  rating!: number;

  @Column({ type: DataType.STRING, allowNull: true })
  title?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  review?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  image: string;

  @BelongsTo(() => User) user!: User;


  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export default ProductRating;