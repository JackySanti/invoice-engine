import { Injectable } from '@nestjs/common';
import { InvoiceDto, ItemDto, TotalDto } from "../dto";
import { InvoiceSummaryService } from "../services/invoice-summary.service";
import { PuppeteerPdfService } from "../../infrastructure/pdf/puppeteer-pdf.service";
import { AwsS3Service } from "../../infrastructure/aws/s3.service";

@Injectable()
export class InvoiceUseCase {
    constructor(
        private readonly invoiceSummaryService: InvoiceSummaryService,
        private readonly puppeteerPdfService: PuppeteerPdfService,
        private readonly awsS3Service: AwsS3Service,
    ) { }

    async calculationSummary(items: ItemDto[], totals: TotalDto): Promise<TotalDto> {
        return this.invoiceSummaryService.calculationSummary(items, totals);
    }

    async generateInvoice(invoiceDto: InvoiceDto): Promise<string> {
        const pdfBuffer = await this.puppeteerPdfService.generatePdf(invoiceDto);
        const key = `invoices/${invoiceDto.invoiceNo}-${Date.now()}.pdf`;
        const url = await this.awsS3Service.uploadFile(key, pdfBuffer, 'application/pdf');
        return url ?? '';
    }
}