import { Module } from "@nestjs/common";
import { AuthController } from "./controller";
import { AuthService } from "./service";
import { CommonModule } from "@/app/common/common.module";
import { ProfileModule } from "./profile/module";

@Module({
    imports: [CommonModule, ProfileModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: []
})
export class AuthModule {}