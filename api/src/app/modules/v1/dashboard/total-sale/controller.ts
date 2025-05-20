import { BadRequestException, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TotalSaleService } from "./service";

@Controller()
export class TotalSaleController {
    constructor(private readonly _service: TotalSaleService) { }

    @Get()
    get() {
        return this._service.get();
    }
}