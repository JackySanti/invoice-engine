import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { InvoiceUseCase } from '../domain/use-case/invoice.use-case';
import { InvoiceSummaryService } from '../domain/services/invoice-summary.service';
import { PuppeteerPdfService } from '../infrastructure/pdf/puppeteer-pdf.service';
import { AwsModule } from '../infrastructure/aws/aws.module';


@Module({
  imports: [AwsModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceUseCase, InvoiceSummaryService, PuppeteerPdfService],
  exports: [InvoiceService],
})
export class InvoiceModule { }
