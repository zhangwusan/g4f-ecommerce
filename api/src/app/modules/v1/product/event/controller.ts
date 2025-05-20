import { Controller, Get, Query } from "@nestjs/common";
import { ProductEventService } from "./service";

@Controller()
export class ProductEventController {
    constructor(private readonly _service: ProductEventService) { }

    @Get()
    get_data(){
        return this._service.get();
    }
}