import { Module } from "@nestjs/common";
import { CartController } from "./controller";
import { CartService } from "./service";
import { UserCartModule } from "./user-cart/module";


@Module({
    imports: [
        UserCartModule
    ],
    controllers: [CartController],
    providers: [CartService],
    exports: []
})
export class CartModule {}