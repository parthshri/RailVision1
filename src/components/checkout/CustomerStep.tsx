"use client";

import { useCheckout } from "@/contexts/CheckoutContext";

export default function CustomerStep() {

  const {
    customerInfo,
    setCustomerInfo,
    setCheckoutStep,
  } = useCheckout();


  function nextStep() {

    if (
      !customerInfo.fullName ||
      !customerInfo.phone ||
      !customerInfo.email
    ) {
      alert("Please fill all required details.");
      return;
    }

    setCheckoutStep(2);
  }


  return (
    <div className="panel">

      <h2>
        Customer Details
      </h2>


      <input
        placeholder="Full Name"
        value={customerInfo.fullName}
        onChange={(e)=>
          setCustomerInfo({
            ...customerInfo,
            fullName:e.target.value,
          })
        }
      />


      <input
        placeholder="Phone Number"
        value={customerInfo.phone}
        onChange={(e)=>
          setCustomerInfo({
            ...customerInfo,
            phone:e.target.value,
          })
        }
      />


      <input
        placeholder="Email"
        value={customerInfo.email}
        onChange={(e)=>
          setCustomerInfo({
            ...customerInfo,
            email:e.target.value,
          })
        }
      />


      <input
        placeholder="Alternate Phone (Optional)"
        value={customerInfo.alternatePhone}
        onChange={(e)=>
          setCustomerInfo({
            ...customerInfo,
            alternatePhone:e.target.value,
          })
        }
      />


      <button
        className="button primary"
        style={{
          marginTop:20
        }}
        onClick={nextStep}
      >
        Continue to Address
      </button>


    </div>
  );
}