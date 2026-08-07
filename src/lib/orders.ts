export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id?: string;

  // Signed-in user UID, or null for guest checkout
  userId: string | null;

  // Helps distinguish guest orders in admin/dashboard
  isGuestOrder?: boolean;

  // Original account email if signed in
  // Checkout email can still be different/editable
  accountEmail?: string | null;

  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    alternatePhone: string;
  };

  shippingAddress: {
    house: string;
    street: string;
    area: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };

  products: OrderItem[];

  total: number;

  paymentMethod:
    | "COD"
    | "UPI_MANUAL";

  paymentStatus:
    | "PENDING"
    | "AWAITING_VERIFICATION"
    | "PAID"
    | "FAILED";

  orderStatus:
    | "PLACED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

  transactionReference?: string;
  estimatedDelivery?: string;
  affiliateCode?: string;
  affiliateName?: string;
  affiliateCommission?: number;

  affiliateStatus?:
    | "PENDING"
    | "APPROVED"
    | "PAID"
    | "REJECTED";

  createdAt?: unknown;
  updatedAt?: unknown;
};