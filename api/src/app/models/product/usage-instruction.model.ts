import {
    Table, Column, Model, DataType, BelongsToMany,
  } from 'sequelize-typescript';
  import Product from './product.model';
import ProductUsageInstruction from './product-usage-instruction.model';
  
  @Table({
    tableName: 'usage_instructions',
    timestamps: false,
  })
  class UsageInstruction extends Model<UsageInstruction> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id!: number;
  
    @Column({ type: DataType.STRING, allowNull: false })
    instruction!: string;
  
    @BelongsToMany(() => Product, () => ProductUsageInstruction)
    products!: Product[];
  }
  
  export default UsageInstruction;