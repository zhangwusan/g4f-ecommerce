import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "./service";


@Controller()
export class DashboardController {
    constructor( private readonly __service: DashboardService ) {}

    @Get()
    get() {
        return this.__service.get()
    }
}