import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Product } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/strategy/interfaces/token-payload.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(
    @Body() dto: CreateProductDto,
    @CurrentUser() payload: TokenPayload,
  ): Promise<Product> {
    return this.productsService.createProduct(dto, payload);
  }
}
