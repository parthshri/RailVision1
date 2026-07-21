import type {
  AffiliateCommissionStatus,
  OrderStatus,
  PaymentStatus,
} from "@/lib/firestoreActions";

export type FirestoreDoc =
  Record<string, unknown> & {
    id: string;
  };

export type AdminOrder =
  FirestoreDoc & {
    userId?: string;

    customerInfo?: {
      fullName?: string;
      email?: string;
      phone?: string;
      alternatePhone?: string;
    };

    shippingAddress?: {
      house?: string;
      street?: string;
      area?: string;
      city?: string;
      state?: string;
      pinCode?: string;
      country?: string;
    };

    products?: {
      productId?: string;
      name: string;
      quantity: number;
      price: number;
    }[];

    total?: number;

    paymentMethod?:
      | "COD"
      | "UPI_MANUAL"
      | "ONLINE";

    paymentStatus?: PaymentStatus;

    orderStatus?: OrderStatus;

    transactionReference?: string;

    affiliateCode?: string;
    affiliateName?: string;
    affiliateCommission?: number;
    affiliateStatus?: AffiliateCommissionStatus;
  };

export type AffiliateApplication =
  FirestoreDoc & {
    fullName?: string;
    email?: string;
    instagramUsername?: string;
    instagramProfileUrl?: string;
    followers?: number;
    contentCategory?: string;
    message?: string;

    status?:
      | "PENDING"
      | "APPROVED"
      | "REJECTED";

    affiliateCode?: string;
    commissionRate?: number;
  };