import {
    Table,
    Column,
    Model,
    DataType,
    BelongsToMany,
  } from 'sequelize-typescript';
  import Product from './product.model';
import ProductIngredient from './product-ingredient.model';
  
  @Table({
    tableName: 'ingredients',
    timestamps: true,
    paranoid: true,
  })
  class Ingredient extends Model<Ingredient> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id!: number;
  
    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    name!: string;
  
    @BelongsToMany(() => Product, () => ProductIngredient)
    products!: Product[];
  }
  
  export default Ingredient;