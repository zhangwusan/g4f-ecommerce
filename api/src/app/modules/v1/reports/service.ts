import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import * as path from "path";
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars'
import * as ExcelJS from 'exceljs';
import { registerHandlebarsHelpers } from "@/app/common/utils/helper/handlebars.helpers";


@Injectable()
export class ReportService {

  constructor() {
    registerHandlebarsHelpers();
  }

  async generate(
    data: any,
    title: string,
    format: 'pdf' | 'excel',
    templatePath?: string
  ) {
    if (!data) {
      throw new Error('No data provided for report generation.');
    }

    if (format === 'excel') {
      // For Excel, just send the array directly
      return this.renderExcel(data, title);
    }

    const templateFile = templatePath
      ? path.resolve(templatePath)
      : path.join(__dirname, '..', '..', '..', '..', '..', 'templates', 'report.hbs'); // Default path

    const templateSource = readFileSync(templateFile, 'utf-8');
    const template = handlebars.compile(templateSource);

    const context = {
      title,
      ...data,
    };

    const html = template(context);

    return this.renderPdf(html);
  }

  // helper function s 
  private async renderPdf(
    html: string,
    options?: {
      puppeteer?: puppeteer.PDFOptions,
      replace?: Record<string, string>
    },
  ): Promise<Buffer> {
    if (options?.replace) {
      for (const [key, value] of Object.entries(options.replace)) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        html = html.replace(regex, value);
      }
    }

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const uint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
      ...options?.puppeteer,
    });

    await browser.close();

    return Buffer.from(uint8Array);
  }

  private async renderExcel(data: any[], title: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title || 'Report');

    const columns = Object.keys(data[0] || {}).map(key => ({
      header: key,
      key,
      width: 20,
    }));

    worksheet.columns = columns;
    worksheet.addRows(data);

    return workbook.xlsx.writeBuffer() as Promise<Buffer>;
  }
}