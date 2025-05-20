import { BadRequestException, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { SalesService } from "./service";

@Controller()
export class SalesController {
    constructor(private readonly _service: SalesService) { }

    @Get()
    get() {
        return this._service.get();
    }
}