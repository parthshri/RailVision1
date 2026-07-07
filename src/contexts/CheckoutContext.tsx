"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

export type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
  alternatePhone: string;
};

export type ShippingAddress = {
  house: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
};

export type PaymentMethod = "ONLINE" | "COD" | "";

type CheckoutContextValue = {
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;

  checkoutStep: number;

  setCustomerInfo: (
    info: CustomerInfo
  ) => void;

  setShippingAddress: (
    address: ShippingAddress
  ) => void;

  setPaymentMethod: (
    method: PaymentMethod
  ) => void;

  setCheckoutStep: (
    step: number
  ) => void;

  resetCheckout: () => void;
};


const defaultCustomerInfo: CustomerInfo = {
  fullName: "",
  email: "",
  phone: "",
  alternatePhone: "",
};


const defaultShippingAddress: ShippingAddress = {
  house: "",
  street: "",
  area: "",
  city: "",
  state: "",
  pinCode: "",
  country: "India",
};


const CheckoutContext =
  createContext<CheckoutContextValue | null>(null);


export function CheckoutProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [customerInfo, setCustomerInfo] =
    useState<CustomerInfo>(
      defaultCustomerInfo
    );


  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress>(
      defaultShippingAddress
    );


  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("");


  const [checkoutStep, setCheckoutStep] =
    useState(1);



  function resetCheckout() {

    setCustomerInfo(
      defaultCustomerInfo
    );

    setShippingAddress(
      defaultShippingAddress
    );

    setPaymentMethod("");

    setCheckoutStep(1);
  }



  const value = useMemo(
    () => ({
      customerInfo,
      shippingAddress,
      paymentMethod,
      checkoutStep,

      setCustomerInfo,
      setShippingAddress,
      setPaymentMethod,

      setCheckoutStep,

      resetCheckout,
    }),

    [
      customerInfo,
      shippingAddress,
      paymentMethod,
      checkoutStep,
    ]
  );



  return (
    <CheckoutContext.Provider
      value={value}
    >
      {children}
    </CheckoutContext.Provider>
  );
}



export function useCheckout() {

  const context =
    useContext(CheckoutContext);


  if (!context) {
    throw new Error(
      "useCheckout must be used inside CheckoutProvider"
    );
  }


  return context;
}