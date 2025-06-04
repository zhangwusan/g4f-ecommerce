import { Module } from "@nestjs/common";
import { ReportController } from "./controller";
import { ReportService } from "./service";
import { SaleReportModule } from "./sale/module";
import { PaymentReportModule } from "./payment/module";

@Module({
    imports: [
        SaleReportModule,
        PaymentReportModule
    ],
    controllers: [ReportController],
    providers: [ReportService],
    exports: []
})
export class ReportModule {}