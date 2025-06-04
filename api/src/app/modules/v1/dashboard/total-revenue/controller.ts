import { BadRequestException, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TotalRevenueService } from "./service";
import { getDateRange } from "@/app/common/utils/helper/date.helper";

@Controller()
export class TotalRevenueController {
    constructor(private readonly _service: TotalRevenueService) { }

    @Get()
    get() {
        // monthly by default
        const { startDate, endDate } = getDateRange();

        return this._service.get(startDate, endDate);
    }
}