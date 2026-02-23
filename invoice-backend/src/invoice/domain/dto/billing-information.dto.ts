import {
    IsString,
    IsOptional,
    Length,
    IsEmail,
    IsUrl
} from 'class-validator';

export class BillingInformationDto {
    @IsString()
    type: string;

    @IsString()
    company: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    @Length(10, 20, { message: 'Phone number must be at least 10 digits' })
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    address: string;

    @IsString()
    @IsOptional()
    cityStateZip?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsUrl()
    @IsOptional()
    website?: string;

    @IsOptional()
    logo?: any;
}