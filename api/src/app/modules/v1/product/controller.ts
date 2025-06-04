import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./service";
import { UserDecorator, UserDecoratorType } from "@/app/common/decorators/user.decorator";
import { BaseQueryDto } from "@/app/common/dto/base-query.dto";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";

@Controller()
export class ProductController {
    constructor(private readonly _service: ProductService) { }

    @Get()
    get_data(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('sort') sort?: string,
        @Query('order') order?: 'asc' | 'desc',
        @Query('search') search?: string,
    ) {
        if (!page || !limit) {
            page = 1,
                limit = 10
        }
        const params = {
            page,
            limit,
            sort,
            order,
            search
        }
        return this._service.get_data(params);
    }


    @Get('/detail/:product_id')
    view(
        @Param('product_id') product_id: number,
    ) {
        return this._service.view(product_id);
    }

    @Post('search-with-text-and-images')
    @UseInterceptors(FileInterceptor('image')) // if using multer
    search_with_text_and_image(
        @Query() query: BaseQueryDto,
        @UploadedFile() image: Express.Multer.File
    ) {
        return this._service.search_with_text_and_image(query, image);
    }

    @Put('update_product_and_clean_cart')
    update_product_and_clean_cart(
        @UserDecorator() user: UserDecoratorType
    ) {
        return this._service.update_product_and_clean_cart(user);
    }

}