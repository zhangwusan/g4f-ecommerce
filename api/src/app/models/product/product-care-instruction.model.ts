import {
    Table, Column, Model, ForeignKey, DataType,
    BelongsTo,
  } from 'sequelize-typescript';
  import Product from './product.model';
  import CareInstruction from './care-instruction.model';
import User from '../user/user.model';
  
  @Table({
    tableName: 'product_care_instructions',
  })
  class ProductCareInstruction extends Model<ProductCareInstruction> {
    @ForeignKey(() => Product)
    @Column({ type: DataType.INTEGER })
    product_id!: number;
  
    @ForeignKey(() => CareInstruction)
    @Column({ type: DataType.INTEGER })
    care_instruction_id!: number;
  }
  
  export default ProductCareInstruction;