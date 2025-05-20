import { BadRequestException, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileService } from "./service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller()
export class FileController {
    constructor(private readonly _service: FileService) { }

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
    upload(@UploadedFile() file: Express.Multer.File) {
        try {
            if (!file) throw new BadRequestException('No file uploaded');
            const url = `/public/uploads/${file.filename}`;
            return {
                message: 'File uploaded successfully',
                avatar: url,
            };
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.message)
        }

    }
}