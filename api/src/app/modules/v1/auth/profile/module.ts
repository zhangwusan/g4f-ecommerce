import { Module } from "@nestjs/common";
import { ProfileService } from "./service";
import { ProfileController } from "./controller";

@Module({
    imports: [],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: []
})
export class ProfileModule {}