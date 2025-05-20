import { BadRequestException, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TopSellingService } from "./service";

@Controller()
export class TopSellingController {
    constructor(private readonly _service: TopSellingService) { }

    @Get()
    get() {
        return this._service.get();
    }
}