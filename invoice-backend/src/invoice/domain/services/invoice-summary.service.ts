import { Injectable } from '@nestjs/common';
import { AmountType, InvoiceItemType } from '../enums/enum';
import { ItemDto, TotalDto } from '../dto';

@Injectable()
export class InvoiceSummaryService {
    calculationSummary(items: ItemDto[], totals: TotalDto): TotalDto {
        const types = new Set(items.map(item => item.type));

        if (types.size > 1) {
            throw new Error('Service and Product cannot be mixed on the same invoice');
        }

        totals.subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (items[0].type === InvoiceItemType.Service) {
            //Apply discount first, then tax
            let discountValue = (totals.type_discount === AmountType.Percent) ? totals.subtotal * (1 - (totals.discount || 0) / 100)
                : totals.subtotal - (totals.discount || 0);

            totals.total = (totals.type_tax === AmountType.Percent) ? discountValue * (1 - (totals.tax || 0) / 100)
                : discountValue - (totals.tax || 0);
        } else {
            // Apply tax first, then discount
            let taxValue = (totals.type_tax === AmountType.Percent) ? totals.subtotal * (1 - (totals.tax || 0) / 100)
                : totals.subtotal - (totals.tax || 0);

            totals.total = (totals.type_discount === AmountType.Percent) ? taxValue * (1 - (totals.discount || 0) / 100)
                : taxValue - (totals.discount || 0);
        }

        return totals;
    }
}
