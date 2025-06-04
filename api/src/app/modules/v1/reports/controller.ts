import { Body, Controller, Post, Res } from "@nestjs/common";
import { ReportService } from "./service";
import { GenerateReportDto } from "./dto";
import { Response } from 'express';

@Controller()
export class ReportController {
    constructor(private readonly _service: ReportService) { }
    @Post('generate')
    async generate(
        @Body() body: GenerateReportDto,
        @Res() res: Response
    ) {
        try {
            const { format, title, data, templatePath } = body;
            const buffer = await this._service.generate(data, title, format, templatePath);

            const mimeType = format === 'excel'
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                : 'application/pdf';

            const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;

            res.json({
                filename: `report.${format === 'excel' ? 'xlsx' : 'pdf'}`,
                mimeType,
                base64
            });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Failed to generate report.' });
        }
    }
}