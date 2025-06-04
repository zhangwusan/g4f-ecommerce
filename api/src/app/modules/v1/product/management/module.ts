import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ProductManagementService } from "./service";
import { ProductManagementController } from "./controller";
import { largeBodyParserForManagement } from "@/app/common/middlewares/large-body-parser.middleware";


@Module({
    imports: [],
    controllers: [ProductManagementController],
    providers: [ProductManagementService],
    exports: []
})
export class ProductManagementModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(largeBodyParserForManagement)
            .forRoutes({
                path: 'management',
                method: RequestMethod.POST,
            });
    }
}