import { Product } from "./products";


export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};


export type Order = {
  id?: string;

  userId: string;

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
    | "ONLINE"
    | "COD";


  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED";


  orderStatus:
    | "PLACED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";


  createdAt?: unknown;
};