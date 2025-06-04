import { Routes } from "@nestjs/core";
import { UserModule } from "./module";

export const userRoutes: Routes = [
    {
        path: '/',
        children: [
            {
                path: '/',
                module: UserModule
            },
        ]
    }
]