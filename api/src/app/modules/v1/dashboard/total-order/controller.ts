import { Controller, Get } from "@nestjs/common";
import { TotalOrderService } from "./service";
import { getDateRange } from "@/app/common/utils/helper/date.helper";

@Controller()
export class TotalOrderController {
    constructor(private readonly _service: TotalOrderService) { }

    @Get()
    get() {
        const {startDate, endDate} = getDateRange()
        return this._service.get(startDate, endDate);
    }
}