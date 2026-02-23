import {
    IsString,
    IsOptional,
    IsDateString,
    Length,
    ValidateNested,
    ArrayNotEmpty,
    IsArray
} from 'class-validator';
import {
    Type
} from 'class-transformer';
import {
    BillingInformationDto
} from './billing-information.dto';
import {
    ItemDto
} from './item.dto';
import {
    TotalDto
} from './total.dto';

export class InvoiceDto {
    @IsString()
    @Length(1, 10, { message: 'Invoice number must be between 1 and 10 characters' })
    invoiceNo: string;

    @IsDateString({}, { message: 'Invoice date must be a valid date string' })
    invoiceDate: string;

    @IsDateString({}, { message: 'Due date must be a valid date string' })
    dueDate: string;

    @IsString()
    @IsOptional()
    notes?: string;

    // Array of items
    @IsArray()
    @ArrayNotEmpty({ message: 'Items cannot be empty' })
    @ValidateNested({ each: true })
    @Type(() => ItemDto)
    items: ItemDto[];

    // Array of billing information
    @IsArray()
    @ArrayNotEmpty({ message: 'Billing information cannot be empty' })
    @ValidateNested({ each: true })
    @Type(() => BillingInformationDto)
    billingInformation: BillingInformationDto[];

    @ValidateNested()
    @Type(() => TotalDto)
    total: TotalDto;
}