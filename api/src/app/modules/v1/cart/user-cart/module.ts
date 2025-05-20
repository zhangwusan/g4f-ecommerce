import { Module } from "@nestjs/common";
import { UserCartController } from "./controller";
import { UserCartService } from "./service";


@Module({
    imports: [],
    controllers: [UserCartController],
    providers: [UserCartService],
    exports: []
})
export class UserCartModule {}