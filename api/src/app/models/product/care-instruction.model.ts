import {
    Table, Column, Model, DataType, BelongsToMany,
  } from 'sequelize-typescript';
  import Product from './product.model';
import ProductCareInstruction from './product-care-instruction.model';
  
  @Table({
    tableName: 'care_instructions',
    timestamps: false,
  })
  class CareInstruction extends Model<CareInstruction> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id!: number;
  
    @Column({ type: DataType.STRING, allowNull: false })
    instruction!: string;
  
    @BelongsToMany(() => Product, () => ProductCareInstruction)
    products!: Product[];
  }
  
  export default CareInstruction;