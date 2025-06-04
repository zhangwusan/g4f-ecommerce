import { BadRequestException, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { RecentSalesService } from "./service";
import { getDateRange } from "@/app/common/utils/helper/date.helper";

@Controller()
export class RecentSalesController {
    constructor(private readonly _service: RecentSalesService) { }

    @Get()
    get() {
        const {startDate, endDate} = getDateRange();
        return this._service.get(startDate, endDate);
    }
}