import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/module";
import { ProductModule } from "./product/module";
import { BrandModule } from "./brand/module";
import { CategoryModule } from "./category/module";
import { CartModule } from "./cart/module";
import { FileModule } from "./file/module";
import { PaymentModule } from "./payment/module";
import { DashboardModule } from "./dashboard/module";


@Module({
    imports: [
        AuthModule,
        BrandModule,
        ProductModule,
        CategoryModule,
        CartModule,
        FileModule,
        PaymentModule,
        DashboardModule
    ],
    controllers: [],
    providers: [],
    exports: []
})
export class V1Module {}