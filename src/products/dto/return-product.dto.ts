import { Exclude } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ReturnProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: string;

  @Exclude()
  id: string;

  @Exclude()
  userId: string;
}
