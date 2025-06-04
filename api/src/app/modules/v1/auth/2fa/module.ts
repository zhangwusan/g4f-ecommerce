import { Module } from "@nestjs/common";
import { E2FAService } from "./service";
import { E2FAController } from "./controller";
import { CommonModule } from "@/app/common/common.module";

@Module({
    imports: [CommonModule],
    controllers: [E2FAController],
    providers: [E2FAService],
    exports: []
})
export class E2FAModule {}