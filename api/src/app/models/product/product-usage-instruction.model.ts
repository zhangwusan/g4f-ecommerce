import {
    Table, Column, Model, ForeignKey, DataType,
    BelongsTo,
  } from 'sequelize-typescript';
  import Product from './product.model';
import UsageInstruction from './usage-instruction.model';
  
  @Table({
    tableName: 'product_usage_instructions',
    timestamps: false,
  })
  class ProductUsageInstruction extends Model<ProductUsageInstruction> {
    @ForeignKey(() => Product)
    @Column({ type: DataType.INTEGER })
    product_id!: number;
  
    @ForeignKey(() => UsageInstruction)
    @Column({ type: DataType.INTEGER })
    usage_instruction_id!: number;
  }
  
  export default ProductUsageInstruction;