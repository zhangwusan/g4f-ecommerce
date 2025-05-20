import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto, RegisterDto } from "./dto";
import { AuthService } from "./service";
import { TokenPair, Tokens } from "@/app/common/decorators/token.decorator";

@Controller()
export class AuthController {
    constructor(
        private readonly _service: AuthService
    ){}
    @Post('login')
    login(
        @Body() body: LoginDto
    ) {
        return this._service.login(body);
    }

    @Post('register')
    register(
        @Body() body: RegisterDto
    ){
        return this._service.register(body);
    }

    @Post('logout')
    logout(@Tokens() tokens: TokenPair) {
        return this._service.logout(tokens);
    }

    @Post('refresh-token')
    refresh_token(@Tokens() tokens: TokenPair){
        return this._service.refresh_token(tokens);
    }

}