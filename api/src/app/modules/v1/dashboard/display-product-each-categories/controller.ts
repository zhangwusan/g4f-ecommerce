import { BadRequestException, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { DisplayProductEachCategoriesService } from "./service";

@Controller()
export class DisplayProductEachCategoriesController {
    constructor(private readonly _service: DisplayProductEachCategoriesService) { }

    @Get()
    get() {
        return this._service.get();
    }
}