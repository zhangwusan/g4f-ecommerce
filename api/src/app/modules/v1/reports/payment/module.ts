import { Module } from "@nestjs/common";
import { PaymentReportController } from "./controller";
import { ReportService } from "../service";
import { PaymentReportService } from "./service";

@Module({
    imports: [],
    controllers: [PaymentReportController],
    providers: [PaymentReportService, ReportService],
    exports: []
})
export class PaymentReportModule {}