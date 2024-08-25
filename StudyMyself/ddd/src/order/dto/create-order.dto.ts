// create-order.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReceiverDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;
}

export class CreateMoneyDto {
  @IsNumber()
  @IsNotEmpty()
  value: number;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => CreateReceiverDto)
  receiver: CreateReceiverDto;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @IsString()
  @IsNotEmpty()
  product: string;

  @IsString()
  @IsNotEmpty()
  orderName: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ValidateNested()
  @Type(() => CreateMoneyDto)
  price: CreateMoneyDto;
}
