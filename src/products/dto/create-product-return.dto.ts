import { IsString } from 'class-validator';

export class CreateProductReturnDto {
  @IsString()
  id: string;
}
