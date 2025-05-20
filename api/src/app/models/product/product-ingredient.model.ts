import {
    Table,
    Column,
    Model,
    ForeignKey,
    DataType,
  } from 'sequelize-typescript';
  import Product from './product.model';
  import Ingredient from './ingredient.model';
  
  @Table({
    tableName: 'product_ingredients',
    timestamps: false,
  })
  class ProductIngredient extends Model<ProductIngredient> {
    @ForeignKey(() => Product)
    @Column({ type: DataType.INTEGER })
    product_id!: number;
  
    @ForeignKey(() => Ingredient)
    @Column({ type: DataType.INTEGER })
    ingredient_id!: number;
  }
  
  export default ProductIngredient;