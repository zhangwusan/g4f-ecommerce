import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserController } from "./controller";
import { UserService } from "./service";
import { largeBodyParser } from "@/app/common/middlewares/large-body-parser.middleware";

@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: []
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(largeBodyParser)
            .forRoutes({
                path: 'user',
                method: RequestMethod.POST,
            });
    }
}