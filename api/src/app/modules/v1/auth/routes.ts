import { Routes } from "@nestjs/core";
import { ProfileModule } from "./profile/module";
import { AuthModule } from "./module";


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
        ]
    }
]