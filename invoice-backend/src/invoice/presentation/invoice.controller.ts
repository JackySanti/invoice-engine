import {
    Controller,
    Post,
    Patch,
    Body,
    Param,
    BadRequestException
} from '@nestjs/common';
import {
    InvoiceDto,
    ItemDto,
    TotalDto
} from '../domain/dto';
import {
    InvoiceService
} from './invoice.service';

@Controller('invoice')
export class InvoiceController {
    constructor(
        private readonly service: InvoiceService,
    ) { }

    @Post('calculation-summary')
    async calculationSummary(
        @Body() body: { items: ItemDto[]; totals: TotalDto }
    ): Promise<TotalDto> {
        const { items, totals } = body;

        if (!items || items.length === 0) {
            throw new BadRequestException('Items are required');
        }
        
        return this.service.calculationSummary(items, totals);
    }

    @Post('generate-invoice')
    async generateInvoice(
        @Body() invoiceDto: InvoiceDto,
    ): Promise<string> {
        if (!invoiceDto) {
            throw new BadRequestException('invoiceDto are required');
        }

        return this.service.generateInvoice(invoiceDto);
    }
}
