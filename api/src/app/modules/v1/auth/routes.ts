import { Routes } from "@nestjs/core";
import { ProfileModule } from "./profile/module";
import { AuthModule } from "./module";
import { E2FAModule } from "./2fa/module";


export const authRoutes: Routes = [
    {
        path: '/',
        children: [
            {
                path: '/',
                module: AuthModule
            },
            {
                path: 'profile',
                module: ProfileModule
            },
            {
                path: '2fa',
                module: E2FAModule
            }
        ]
    }
]