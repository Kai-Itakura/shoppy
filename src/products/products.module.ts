import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsController } from './products.controller';
import { ProductsGateway } from './products.gateway';
import { ProductsService } from './products.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsGateway],
  exports: [ProductsService],
})
export class ProductsModule {}
