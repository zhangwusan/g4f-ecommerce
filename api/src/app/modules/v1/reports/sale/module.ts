import { Module } from "@nestjs/common";
import { SaleReportController } from "./controller";
import { SaleReportService } from "./service";
import { ReportService } from "../service";

@Module({
    imports: [],
    controllers: [SaleReportController],
    providers: [SaleReportService, ReportService],
    exports: []
})
export class SaleReportModule {}