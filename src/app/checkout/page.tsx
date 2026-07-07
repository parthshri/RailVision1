"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { useCheckout } from "@/contexts/CheckoutContext";

import CustomerStep from "@/components/checkout/CustomerStep";
import AddressStep from "@/components/checkout/AddressStep";
import PaymentStep from "@/components/checkout/PaymentStep";

import { getProduct } from "@/lib/products";


export default function CheckoutPage() {

  const { user } = useAuth();

  const router = useRouter();

  const searchParams = useSearchParams();


  const productId = searchParams.get("product");


  const directProduct = productId
    ? getProduct(productId)
    : null;



  const {
    checkoutStep,
  } = useCheckout();



  useEffect(() => {

    if (!user) {
      router.push("/auth");
    }

  }, [user, router]);



  if (!user) {
    return null;
  }



  return (

    <section className="section">


      <h1>
        Checkout
      </h1>



      <div
        style={{
          display:"flex",
          justifyContent:"center",
          gap:20,
          margin:"30px 0",
          flexWrap:"wrap"
        }}
      >


        <StepIndicator
          number={1}
          label="Customer"
          active={checkoutStep===1}
        />


        <StepIndicator
          number={2}
          label="Address"
          active={checkoutStep===2}
        />


        <StepIndicator
          number={3}
          label="Payment"
          active={checkoutStep===3}
        />


      </div>



      <div
        style={{
          maxWidth:900,
          margin:"auto"
        }}
      >


        {
          checkoutStep===1 &&
          <CustomerStep />
        }



        {
          checkoutStep===2 &&
          <AddressStep />
        }



        {
          checkoutStep===3 &&
          <PaymentStep 
            directProduct={directProduct}
          />
        }



      </div>


    </section>

  );
}





function StepIndicator({
  number,
  label,
  active,
}:{
  number:number;
  label:string;
  active:boolean;
}) {


  return (

    <div
      style={{
        display:"flex",
        alignItems:"center",
        gap:8,
        padding:"10px 16px",
        border:"1px solid var(--line)",
        borderRadius:999,
        background:
          active
          ? "rgba(85,230,255,0.12)"
          : "rgba(255,255,255,0.03)",
        color:
          active
          ? "var(--cyan)"
          : "var(--muted)",
        fontWeight:800
      }}
    >

      {number}. {label}

    </div>

  );
}