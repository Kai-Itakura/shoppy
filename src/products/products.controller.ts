import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/strategy/interfaces/token-payload.interface';
import { CreateProductReturnDto } from './dto/create-product-return.dto';
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
  ): Promise<CreateProductReturnDto> {
    const newProduct = await this.productsService.createProduct(dto, payload);
    return plainToInstance(CreateProductReturnDto, newProduct);
  }

  @Get()
  async getProducts(
    @CurrentUser() payload: TokenPayload,
  ): Promise<ReturnProductDto[]> {
    const products = await this.productsService.getProDucts(payload.userId);
    return products.map((product) =>
      plainToInstance(ReturnProductDto, product),
    );
  }

  @Get(':productId')
  async getProduct(
    @CurrentUser() payload: TokenPayload,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ReturnProductDto> {
    const product = this.productsService.getProduct(payload.userId, productId);
    return plainToInstance(ReturnProductDto, product);
  }

  @Post(':productId/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/images/products',
        filename: (req, file, callback) => {
          callback(
            null,
            `${req.params.productId}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: 'image/jpeg',
          }),
        ],
      }),
    )
    _file: Express.Multer.File,
  ) {}
}
