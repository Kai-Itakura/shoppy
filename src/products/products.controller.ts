import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Product } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/strategy/interfaces/token-payload.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { ReturnProductDto } from './dto/return-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(
    @Body() dto: CreateProductDto,
    @CurrentUser() payload: TokenPayload,
  ): Promise<Product> {
    return this.productsService.createProduct(dto, payload);
  }

  @Get()
  async getProducts(
    @CurrentUser() payload: TokenPayload,
  ): Promise<ReturnProductDto[]> {
    const products = await this.productsService.getProDucts(payload);
    return products.map((product) =>
      plainToInstance(ReturnProductDto, product),
    );
  }
}
