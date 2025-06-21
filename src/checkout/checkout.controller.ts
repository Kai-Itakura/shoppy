import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/strategy/interfaces/token-payload.interface';
import { CheckoutService } from './checkout.service';
import { CheckoutRequestDto } from './dto/checkout-request.dto';
import { StripeWebhookEvent } from './types/checkout.type';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('session')
  @UseGuards(JwtAuthGuard)
  async createSession(
    @CurrentUser() user: TokenPayload,
    @Body() dto: CheckoutRequestDto,
  ) {
    return this.checkoutService.createSession(user.userId, dto.productId);
  }

  @Post('webhook')
  async handleCheckoutWebhooks(@Body() event: StripeWebhookEvent) {
    this.checkoutService.handleCheckoutWebhook(event);
  }
}
