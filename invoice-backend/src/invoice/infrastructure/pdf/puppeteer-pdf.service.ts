import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { InvoiceDto } from 'src/invoice/domain/dto';
import { BillingInformationDto } from 'src/invoice/domain/dto/billing-information.dto';
import { AmountType } from 'src/invoice/domain/enums/enum';

@Injectable()
export class PuppeteerPdfService {
    private readonly templatePath = join(
        __dirname,
        'templates',
        'invoice.template.html',
    );

    async generatePdf(invoiceDto: InvoiceDto): Promise<Buffer> {
        let html = readFileSync(this.templatePath, 'utf-8');
        html = this.injectData(html, invoiceDto);

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        await page.setContent(html, {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
        });

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm',
            },
        });

        await browser.close();

        return Buffer.from(pdf);
    }

    private injectData(html: string, dto: InvoiceDto): string {
        const billedBy = dto.billingInformation[0];
        const billedTo = dto.billingInformation[1];

        const itemsHtml = dto.items
            .map(
                (item) => `
            <tr>
                <td>${item.itemNumber}</td>
                <td>${item.description}</td>
                <td style="text-align:center;">${item.quantity}</td>
                <td style="text-align:center;">$${item.price.toFixed(2)}</td>
            </tr>`,
            )
            .join('');

        const logoHtml = billedBy?.logo
            ? `<img src="${billedBy.logo}" style="height:6rem; width:auto; margin-bottom:0.5rem;" alt="Logo" />`
            : '';

        return html
            .replaceAll('{{logo}}', logoHtml)
            .replaceAll('{{website}}', billedBy?.website ?? '')
            .replaceAll('{{email}}', billedBy?.email ?? '')
            .replaceAll('{{invoiceNo}}', dto.invoiceNo)
            .replaceAll('{{invoiceDate}}', dto.invoiceDate)
            .replaceAll('{{dueDate}}', dto.dueDate)
            .replaceAll('{{billedBy}}', this.buildBillingSection('Billed by:', billedBy))
            .replaceAll('{{billedTo}}', this.buildBillingSection('Billed to:', billedTo))
            .replaceAll('{{items}}', itemsHtml)
            .replaceAll('{{subtotal}}', `$${(dto.total.subtotal ?? 0).toFixed(2)}`)
            .replaceAll('{{tax}}', dto.total.type_tax === AmountType.Money
                ? `$${dto.total.tax.toFixed(2)}`
                : `${dto.total.tax}%`)
            .replaceAll('{{discount}}', dto.total.type_discount === AmountType.Money
                ? `$${(dto.total.discount ?? 0).toFixed(2)}`
                : `${dto.total.discount ?? 0}%`)
            .replaceAll('{{total}}', `$${(dto.total.total ?? 0).toFixed(2)}`)
            .replaceAll('{{notes}}', dto.notes ?? '');
    }

    private buildBillingSection(title: string, info?: BillingInformationDto): string {
        if (!info) return `<div><p style="color:#4b5563; font-size:0.875rem;">${title}</p></div>`;

        return `
            <div>
                <p style="color:#4b5563; font-size:0.875rem; margin-bottom:0.5rem;">${title}</p>
                <p style="font-size:0.875rem; font-weight:600;">${info.company}</p>
                <p style="color:#4b5563; font-size:0.725rem;">${info.firstName} ${info.lastName}</p>
                ${info.phoneNumber ? `<p style="color:#4b5563; font-size:0.725rem;">${info.phoneNumber}</p>` : ''}
                <p style="color:#4b5563; font-size:0.725rem;">${info.address}</p>
                ${info.cityStateZip ? `<p style="color:#4b5563; font-size:0.725rem;">${info.cityStateZip}</p>` : ''}
                ${info.country ? `<p style="color:#4b5563; font-size:0.725rem;">${info.country}</p>` : ''}
            </div>`;
    }
}
