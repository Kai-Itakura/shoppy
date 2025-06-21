import { IsNumber } from 'class-validator';

export class CheckoutRequestDto {
  @IsNumber()
  productId: number;
}
