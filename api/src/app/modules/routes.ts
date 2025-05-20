import { Routes } from "@nestjs/core";
import { v1Routes } from "./v1/routes";


export const moduleRoutes: Routes = [
    {
        path: '/',
        children: [
            {
                path: 'v1',
                children: v1Routes
            }
        ]
    }
]