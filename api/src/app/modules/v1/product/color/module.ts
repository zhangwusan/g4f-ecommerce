import { Module } from "@nestjs/common";
import { ColorController } from "./controller";
import { ColorService } from "./service";


@Module({
    imports: [],
    controllers: [ColorController],
    providers: [ColorService],
    exports: []
})
export class ColorModule {}