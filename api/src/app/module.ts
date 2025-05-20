import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { appRoutes } from "./routes";
import { RouterModule } from "@nestjs/core";
import { AppController } from "./controller";
import { ConfigModule } from "@/config/config.module";
import { MxModules } from "./modules/module";
import { AuthMiddleware } from "./common/middlewares/auth.middlewares";
import { CommonModule } from "./common/common.module";

@Module({
    controllers: [AppController],
    imports: [
        CommonModule,
        MxModules,
        ConfigModule,
        RouterModule.register(appRoutes)
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(
                { path: '/', method: RequestMethod.GET },
                { path: '/api/mx/v1/auth/login', method: RequestMethod.POST },
                { path: '/api/mx/v1/auth/register', method: RequestMethod.POST },
                { path: '/api/mx/v1/auth/refresh-token', method: RequestMethod.POST },
                { path: '/api/mx/v1/products/event', method: RequestMethod.GET },
                { path: '/api/mx/v1/products/detail/:product_id', method: RequestMethod.GET}
            )
            .forRoutes("*");
    }
}