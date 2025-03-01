import { Exclude } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ReturnProductDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: string;

  @Exclude()
  userId: string;
}
