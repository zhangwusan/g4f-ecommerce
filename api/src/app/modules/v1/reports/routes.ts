import { Routes } from "@nestjs/core";
import { ReportModule } from "./module";
import { SaleReportModule } from "./sale/module";
import { PaymentReportModule } from "./payment/module";


export const reportRoutes: Routes = [
    {
        path: '/',
        children: [
            {
                path: '/',
                module: ReportModule
            },
            {
                path: 'sales',
                module: SaleReportModule
            },
            {
                path: 'payments',
                module: PaymentReportModule
            }
        ]
    }
]