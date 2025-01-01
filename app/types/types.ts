export interface PaymentSession {
    sessionId: string;
    error?: string;
  }
  
  export interface PaymentDetails {
    orderId: number;
    amount: number;
    currency: string;
    description: string;
  }
  
  export interface StripeWebhookEvent {
    type: string;
    data: {
      object: any;
    };
  }