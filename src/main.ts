import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // logger
  app.useLogger(app.get(Logger));

  // validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(app.get(ConfigService).getOrThrow('PORT'));
}
bootstrap();
