"use client";

import { useCheckout } from "@/contexts/CheckoutContext";

export default function AddressStep() {
  const {
    shippingAddress,
    setShippingAddress,
    setCheckoutStep,
  } = useCheckout();


  function nextStep() {
    if (
      !shippingAddress.house ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pinCode
    ) {
      alert("Please complete your shipping address.");
      return;
    }

    setCheckoutStep(3);
  }


  return (
    <div className="panel">

      <h2>
        Shipping Address
      </h2>


      <input
        placeholder="House / Flat Number"
        value={shippingAddress.house}
        onChange={(e)=>
          setShippingAddress({
            ...shippingAddress,
            house:e.target.value,
          })
        }
      />


      <input
        placeholder="Street"
        value={shippingAddress.street}
        onChange={(e)=>
          setShippingAddress({
            ...shippingAddress,
            street:e.target.value,
          })
        }
      />


      <input
        placeholder="Area / Locality"
        value={shippingAddress.area}
        onChange={(e)=>
          setShippingAddress({
            ...shippingAddress,
            area:e.target.value,
          })
        }
      />


      <input
        placeholder="City"
        value={shippingAddress.city}
        onChange={(e)=>
          setShippingAddress({
            ...shippingAddress,
            city:e.target.value,
          })
        }
      />


      <input
        placeholder="State"
        value={shippingAddress.state}
        onChange={(e)=>
          setShippingAddress({
            ...shippingAddress,
            state:e.target.value,
          })
        }
      />


      <input
        placeholder="PIN Code"
        value={shippingAddress.pinCode}
        onChange={(e)=>
          setShippingAddress({
            ...shippingAddress,
            pinCode:e.target.value,
          })
        }
      />


      <input
        placeholder="Country"
        value={shippingAddress.country}
        onChange={(e)=>
          setShippingAddress({
            ...shippingAddress,
            country:e.target.value,
          })
        }
      />



      <div
        style={{
          display:"flex",
          gap:12,
          marginTop:20,
        }}
      >

        <button
          className="button secondary"
          onClick={() =>
            setCheckoutStep(1)
          }
        >
          Back
        </button>


        <button
          className="button primary"
          onClick={nextStep}
        >
          Continue to Payment
        </button>


      </div>


    </div>
  );
}