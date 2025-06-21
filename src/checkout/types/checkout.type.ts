// Stripe Webhook Event Types

interface StripeBillingDetails {
  address: {
    city: string | null;
    country: string | null;
    line1: string | null;
    line2: string | null;
    postal_code: string | null;
    state: string | null;
  } | null;
  email: string | null;
  name: string | null;
  phone: string | null;
}

interface StripeOutcome {
  network_status: string;
  reason: string | null;
  risk_level: string;
  risk_score: number;
  seller_message: string;
  type: string;
}

interface StripePaymentMethodDetails {
  card?: {
    brand: string;
    checks: {
      address_line1_check: string | null;
      address_postal_code_check: string | null;
      cvc_check: string | null;
    };
    country: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    installments: any | null;
    last4: string;
    mandate: any | null;
    network: string;
    three_d_secure: any | null;
    wallet: any | null;
  };
  type: string;
}

interface StripeCharge {
  id: string;
  object: 'charge';
  amount: number;
  amount_captured: number;
  amount_refunded: number;
  application: string | null;
  application_fee: string | null;
  application_fee_amount: number | null;
  balance_transaction: string | null;
  billing_details: StripeBillingDetails;
  calculated_statement_descriptor: string | null;
  captured: boolean;
  created: number;
  currency: string;
  customer: string | null;
  description: string | null;
  destination: string | null;
  dispute: string | null;
  disputed: boolean;
  failure_balance_transaction: string | null;
  failure_code: string | null;
  failure_message: string | null;
  fraud_details: Record<string, any>;
  livemode: boolean;
  metadata: Record<string, string>;
  on_behalf_of: string | null;
  order: string | null;
  outcome: StripeOutcome;
  paid: boolean;
  payment_intent: string;
  payment_method: string;
  payment_method_details: StripePaymentMethodDetails;
  radar_options: Record<string, any>;
  receipt_email: string | null;
  receipt_number: string | null;
  receipt_url: string;
  refunded: boolean;
  review: string | null;
  shipping: any | null;
  source: any | null;
  source_transfer: string | null;
  statement_descriptor: string | null;
  statement_descriptor_suffix: string | null;
  status: 'succeeded' | 'pending' | 'failed';
  transfer_data: any | null;
  transfer_group: string | null;
}

interface StripeWebhookRequest {
  id: string | null;
  idempotency_key: string | null;
}

interface StripeChargeUpdatedEventData {
  object: StripeCharge;
  previous_attributes: Partial<StripeCharge>;
}

interface StripeChargeUpdatedEvent {
  id: string;
  object: 'event';
  api_version: string;
  created: number;
  data: StripeChargeUpdatedEventData;
  livemode: boolean;
  pending_webhooks: number;
  request: StripeWebhookRequest;
  type: 'charge.updated';
}

// より汎用的なWebhookイベント型
interface StripeWebhookEvent<T = any> {
  id: string;
  object: 'event';
  api_version: string;
  created: number;
  data: {
    object: T;
    previous_attributes?: Partial<T>;
  };
  livemode: boolean;
  pending_webhooks: number;
  request: StripeWebhookRequest;
  type: string;
}

// 使用例
export type {
  StripeBillingDetails,
  StripeCharge,
  StripeChargeUpdatedEvent,
  StripeOutcome,
  StripePaymentMethodDetails,
  StripeWebhookEvent,
};
