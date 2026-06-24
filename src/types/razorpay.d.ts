export {};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }

  type RazorpayOptions = {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayPaymentResponse) => void;
    prefill?: {
      name?: string | null;
      email?: string | null;
    };
    theme?: {
      color?: string;
    };
    modal?: {
      ondismiss?: () => void;
    };
  };

  type RazorpayPaymentResponse = {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };
}
