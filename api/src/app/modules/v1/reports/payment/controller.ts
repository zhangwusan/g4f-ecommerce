import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { PaymentReportService } from "./service";
import { UserDecorator, UserDecoratorType } from "@/app/common/decorators/user.decorator";

@Controller()
export class PaymentReportController {
  constructor(private readonly _service: PaymentReportService) { }

  @Get(':payment_id')
  async get_id(
    @Param('payment_id') payment_id: number,
    @UserDecorator() user: UserDecoratorType
  ) {
    const data = await this._service.get_transaction_by_id(payment_id, user.id);
    return { data }
  }

}