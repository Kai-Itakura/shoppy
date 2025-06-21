import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
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

  async getProDucts(userId: number, status?: string): Promise<Product[]> {
    const args: Prisma.ProductFindManyArgs = { where: { userId } };
    if (status === 'available') args.where = { sold: false };

    return this.prismaService.product.findMany(args);
  }

  async getProduct(userId: number, productId: number): Promise<Product> {
    const product = await this.prismaService.product.findUnique({
      where: {
        userId,
        id: productId,
      },
    });

    if (!product) throw new ForbiddenException('Product not found!');

    return product;
  }

  async updateProduct(
    productId: number,
    data: Prisma.ProductUpdateInput,
  ): Promise<void> {
    await this.prismaService.product.update({
      where: { id: productId },
      data,
    });
  }
}
