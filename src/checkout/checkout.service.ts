import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from 'src/products/products.service';
import Stripe from 'stripe';
import { StripeWebhookEvent } from './types/checkout.type';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly stripe: Stripe,
    private readonly productService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  async createSession(userId: number, productId: number) {
    const product = await this.productService.getProduct(userId, productId);
    return this.stripe.checkout.sessions.create({
      metadata: { productId },
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            unit_amount: product.price,
            product_data: {
              name: product.name,
              description: product.description,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: this.configService.getOrThrow('STRIPE_SUCCESS_URL'),
      cancel_url: this.configService.getOrThrow('STRIPE_CANCEL_URL'),
    });
  }

  async handleCheckoutWebhook(event: StripeWebhookEvent) {
    if (event.type !== 'checkout.session.completed') return;

    const session = await this.stripe.checkout.sessions.retrieve(
      event.data.object.id,
    );

    await this.productService.updateProduct(
      parseInt(session.metadata.productId),
      {
        sold: true,
      },
    );
  }
}
