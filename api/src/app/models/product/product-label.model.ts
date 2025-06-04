import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Product from "./product.model";
import Label from "./label.model";

@Table({ 
    tableName: 'product_labels', 
    timestamps: false
})
class ProductLabel extends Model<ProductLabel> {

    @ForeignKey(() => Product)
    @Column
    product_id!: number;

    @ForeignKey(() => Label)
    @Column
    label_id!: number;

    @BelongsTo(() => Product)
    product!: Product;

    @BelongsTo(() => Label)
    label!: Label;
}

export default ProductLabel;