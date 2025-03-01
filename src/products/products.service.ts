import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { TokenPayload } from 'src/auth/strategy/interfaces/token-payload.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(
    dto: CreateProductDto,
    payload: TokenPayload,
  ): Promise<Product> {
    return this.prismaService.product.create({
      data: {
        ...dto,
        userId: payload.userId,
      },
    });
  }

  async getProDucts(payload: TokenPayload): Promise<Product[]> {
    return this.prismaService.product.findMany({
      where: { userId: payload.userId },
    });
  }
}
