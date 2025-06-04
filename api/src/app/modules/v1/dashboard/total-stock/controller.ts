import { BadRequestException, Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TotalStockService } from "./service";
import { getDateRange } from "@/app/common/utils/helper/date.helper";

@Controller()
export class TotalStockController {
    constructor(private readonly _service: TotalStockService) { }

    @Get()
    get(
        @Body() body: { id?: number }
    ) {
        const {startDate, endDate} = getDateRange();
        return this._service.get(body.id, startDate, endDate);
    }
}