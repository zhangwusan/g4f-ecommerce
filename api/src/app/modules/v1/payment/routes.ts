import { Routes } from "@nestjs/core";
import { PAYKHQRModule } from "./pay-khqr/module";
import { PaymentModule } from "./module";


export const paymentRoutes: Routes = [
    {
        path: '/',
        children: [
            {
                path: '/',
                module: PaymentModule
            },
            {
                path: 'khqr',
                module: PAYKHQRModule
            },
        ]
    }
]