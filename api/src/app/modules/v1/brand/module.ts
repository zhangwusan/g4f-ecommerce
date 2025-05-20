import { Module } from "@nestjs/common";
import { BrandController } from "./controller";
import { BrandService } from "./service";

@Module({
    imports: [],
    controllers: [BrandController],
    providers: [BrandService],
    exports: []
})
export class BrandModule {}