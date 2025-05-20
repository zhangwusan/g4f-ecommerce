import {
    Table, Column, Model, ForeignKey, DataType,
  } from 'sequelize-typescript';
  import Product from './product.model';
  import CareInstruction from './care-instruction.model';
  
  @Table({
    tableName: 'product_care_instructions',
    timestamps: false,
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