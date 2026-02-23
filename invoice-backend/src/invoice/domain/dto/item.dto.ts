import {
    IsNotEmpty,
    IsString,
    IsNumber,
    Min,
    IsEnum
} from 'class-validator';
import {
    Type
} from 'class-transformer';
import {
    InvoiceItemType
} from '../enums/enum';

export class ItemDto {
    @IsString()
    @IsNotEmpty({ message: 'Item number is required' })
    itemNumber: string;

    @IsString()
    @IsNotEmpty({ message: 'Item description is required' })
    description: string;

    @IsNumber()
    @Min(1, { message: 'Quantity must be at least 1' })
    @Type(() => Number)
    quantity: number;

    @IsNumber()
    @Min(0, { message: 'Price cannot be negative' })
    @Type(() => Number)
    price: number;

    @IsEnum(InvoiceItemType, { message: 'Type must be either Service or Product' })
    @IsNotEmpty({ message: 'Type is required' })
    type: InvoiceItemType;
}