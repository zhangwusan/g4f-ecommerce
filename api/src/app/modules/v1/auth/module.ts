import { Module } from "@nestjs/common";
import { AuthController } from "./controller";
import { AuthService } from "./service";
import { CommonModule } from "@/app/common/common.module";
import { ProfileModule } from "./profile/module";
import { E2FAModule } from "./2fa/module";

@Module({
    imports: [
        CommonModule, 
        ProfileModule,
        E2FAModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: []
})
export class AuthModule {}