import { Body, Controller, Post } from "@nestjs/common";
import { PAYKHQRService } from "./service";
import { CheckListTransactionKHQRDto, CheckTransactionKHQRDto, GenerateQrKHQRDto, HashCheckTransactionKHQRDto, Md5CheckTransactionKHQRDto } from "./dto";

@Controller()
export class PAYKHQRController {
    constructor(private readonly _service: PAYKHQRService) { }

    @Post('generate')
    generate_qr(
        @Body() body: GenerateQrKHQRDto
    ) {
        return this._service.generate_khqr(body.amount);
    }

    @Post('check-transaction')
    check_transaction(
        @Body() body: CheckTransactionKHQRDto
    ) {
        return this._service.check_payment(body.type, body.value);
    }

    @Post('check-list-transaction')
    check_list_transaction(
        @Body() body: CheckListTransactionKHQRDto
    ) {
        return this._service.check_list_payment(body.type, body.values);
    }

    @Post('check-transaction-md5')
    transaction_md5(
        @Body() body: Md5CheckTransactionKHQRDto
    ) {
        return this._service.check_payment_transaction_md5(body.md5);
    }

    @Post('check-transaction-hash')
    transaction_hash(
        @Body() body: HashCheckTransactionKHQRDto
    ) {
        return this._service.check_payment_transaction_hash(body.hash);
    }


}