import { Controller, Get, Query, Res } from "@nestjs/common";
import { SaleReportService } from "./service";
import { getDateRange } from "@/app/common/utils/helper/date.helper";
import { Response } from 'express';
import { SalesReportQueryDto } from "./dto";

@Controller()
export class SaleReportController {
  constructor(private readonly _service: SaleReportService) {}

  @Get()
  async sale_report(
    @Query() query: SalesReportQueryDto,
    @Res() res: Response,
  ) {
    const { type = 'monthly', customStartDate, customEndDate } = query;

    let startDate: Date;
    let endDate: Date;

    try {
      if (type === 'custom') {
        if (!customStartDate || !customEndDate) {
          return res.status(400).send('customStartDate and customEndDate are required for custom type');
        }
        // Parse date strings from query to Date objects
        startDate = new Date(customStartDate);
        endDate = new Date(customEndDate);
      } else {
        // Use getDateRange util for other types
        ({ startDate, endDate } = getDateRange({ type }));
      }
    } catch (err) {
      return res.status(400).send(err.message);
    }

    // Fetch sales report data using date range
    const data = await this._service.get_sale(type, startDate, endDate);

    // Example: return JSON for now (you can replace with CSV or PDF response)
    return res.json({
      period: type,
      startDate: startDate.toUTCString(),
      endDate: endDate.toUTCString(),
      data: data
    });
  }
}