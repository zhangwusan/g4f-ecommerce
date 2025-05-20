import { BadRequestException, Body, Controller, Get, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ProfileService } from "./service";
import { UserDecorator, UserDecoratorType } from "@/app/common/decorators/user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { ChangeInfomationRequest, ChangePasswordRequest } from "./dto";

@Controller()
export class ProfileController {
    constructor(
        private readonly _service: ProfileService
    ) { }

    @Get('setup')
    setup(
        @UserDecorator() user: UserDecoratorType
    ) {
        return this._service.setup(user);
    }

    @Get()
    view(
        @UserDecorator() user: UserDecoratorType
    ) {
        return this._service.view(user);
    }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './public/uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    upload(@UploadedFile() file: Express.Multer.File, @UserDecorator() user: UserDecoratorType) {
        try {
            if (!file) throw new BadRequestException('No file uploaded');
            const url = `/public/uploads/${file.filename}`;
            return this._service.upload_avatar(url, user)
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.message)
        }

    }

    @Post('password-change')
    change_password(
        @Body() body: ChangePasswordRequest,
        @UserDecorator() user: UserDecoratorType
    ) {
        return this._service.change_password(body, user);
    }

    @Patch('change-infomation')
    change_infomation(
        @Body() body: ChangeInfomationRequest,
        @UserDecorator() user: UserDecoratorType
    ) {
        return this._service.change_information(body, user);
    }
}