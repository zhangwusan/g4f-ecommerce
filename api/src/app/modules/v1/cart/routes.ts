import { Routes } from "@nestjs/core";
import { CartModule } from "./module";
import { UserCartModule } from "./user-cart/module";

export const cartRoutes: Routes = [
    {
        path: '/',
        children: [
            {
                path: '/',
                module: CartModule
            },
            {
                path: 'user-cart',
                module: UserCartModule
            }
        ]
    }
]