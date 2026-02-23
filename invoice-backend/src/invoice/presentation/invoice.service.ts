import {
    Injectable
} from '@nestjs/common';
import {
    InvoiceUseCase
} from '../domain/use-case/invoice.use-case';
import {
    InvoiceDto,
    ItemDto,
    TotalDto
} from '../domain/dto';

@Injectable()
export class InvoiceService {
    constructor(
        private readonly invoiceUseCase: InvoiceUseCase,
    ) { }

    async calculationSummary(items: ItemDto[], totals: TotalDto): Promise<TotalDto> {
        return this.invoiceUseCase.calculationSummary(items, totals);
    }

    async generateInvoice(invoiceDto: InvoiceDto): Promise<string> {
        return this.invoiceUseCase.generateInvoice(invoiceDto);
    }
}
