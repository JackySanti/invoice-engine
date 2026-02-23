import {
    IsNumber,
    IsOptional,
    Min,
    IsNotEmpty,
    IsEnum
} from 'class-validator';
import {
    Type
} from 'class-transformer';
import {
    AmountType
} from '../enums/enum';

export class TotalDto {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Min(0, { message: 'Subtotal cannot be negative' })
    subtotal?: number;

    @IsNumber()
    @IsNotEmpty({ message: 'Tax is required' })
    @Type(() => Number)
    @Min(0, { message: 'Tax cannot be negative' })
    tax: number;

    @IsEnum(AmountType, { message: 'Type must be either Money or Percent' })
    @IsNotEmpty({ message: 'Type is required' })
    type_tax: AmountType;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Min(0, { message: 'Discount cannot be negative' })
    discount?: number;

    @IsEnum(AmountType, { message: 'Type must be either Money or Percent' })
    @IsNotEmpty({ message: 'Type is required' })
    type_discount: AmountType;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Min(0, { message: 'Total cannot be negative' })
    total?: number;

}