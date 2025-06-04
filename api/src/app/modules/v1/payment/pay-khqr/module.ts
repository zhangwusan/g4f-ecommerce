import { Module } from "@nestjs/common";
import { PAYKHQRController } from "./controller";
import { PAYKHQRService } from "./service";


@Module({
    imports: [],
    controllers: [PAYKHQRController],
    providers: [PAYKHQRService],
    exports: []
})
export class PAYKHQRModule {}