import { Routes } from "@nestjs/core";
import { moduleRoutes } from "./modules/routes";

export const appRoutes: Routes = [{
    path: 'api',
    children: [
        {
            path: 'mx',
            children: moduleRoutes
        }
    ]
}]
