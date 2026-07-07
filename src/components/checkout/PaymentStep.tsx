"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";
import { useCheckout } from "@/contexts/CheckoutContext";
import { useCart } from "@/contexts/CartContext";

import {
  formatCurrency,
  getProduct,
  Product,
} from "@/lib/products";

import { createOrder } from "@/lib/firestoreActions";
import { loadRazorpayScript } from "@/lib/razorpay";


type PaymentStepProps = {
  directProduct?: Product | null;
};


export default function PaymentStep({
  directProduct,
}: PaymentStepProps) {


  const {
    customerInfo,
    shippingAddress,
    paymentMethod,
    setPaymentMethod,
    setCheckoutStep,
  } = useCheckout();


  const cart = useCart();

  const { user } = useAuth();

  const router = useRouter();



  const products = directProduct
    ? [
        {
          productId: directProduct.id,
          name: directProduct.name,
          quantity: 1,
          price: directProduct.price,
        },
      ]
    : cart.items.map((item)=>{

        const product =
          getProduct(item.productId);


        return {

          productId:item.productId,

          name:
            product?.name || "",

          quantity:
            item.quantity,

          price:
            product?.price || 0,

        };

      });



  const total =
    products.reduce(
      (sum,item)=>
        sum +
        item.price *
        item.quantity,
      0
    );




  async function saveOrder(
    paymentStatus:"PENDING"|"PAID"
  ){

    if(!user) return;


    await createOrder({

      userId:user.uid,

      customerInfo,

      shippingAddress,

      products,

      total,

      paymentMethod:
        paymentMethod as "ONLINE"|"COD",

      paymentStatus,

      orderStatus:"PLACED" as const,

    });

  }




  async function startOnlinePayment(){

    const loaded =
      await loadRazorpayScript();



    if(!loaded){

      toast.error(
        "Unable to load payment gateway"
      );

      return;

    }



    const response =
      await fetch(
        "/api/razorpay/order",
        {

          method:"POST",

          headers:{
            "Content-Type":
              "application/json",
          },

          body:JSON.stringify({

            amount:total,

            receipt:
              `railvision_${Date.now()}`,

          }),

        }
      );



    const razorpayOrder =
      await response.json();



    const options = {


      key:
        process.env
        .NEXT_PUBLIC_RAZORPAY_KEY_ID || "",


      amount:
        razorpayOrder.amount,


      currency:"INR",


      name:"RailVision",


      description:
        "RailVision Product Purchase",


      order_id:
        razorpayOrder.id,



      handler:async function(response:any){


        const verify =
          await fetch(
            "/api/razorpay/verify",
            {

              method:"POST",

              headers:{
                "Content-Type":
                  "application/json",
              },


              body:JSON.stringify({

                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

              }),

            }
          );



        const result =
          await verify.json();



        if(result.verified){

          await saveOrder("PAID");


          toast.success(
            "Payment successful!"
          );


          router.push(
            "/order-success"
          );


        }else{

          toast.error(
            "Payment verification failed"
          );

        }


      },



      prefill:{

        name:
          customerInfo.fullName,

        email:
          customerInfo.email,

        contact:
          customerInfo.phone,

      },


      theme:{
        color:"#55e6ff",
      },


    };



    if(!window.Razorpay){

      toast.error(
        "Razorpay unavailable"
      );

      return;

    }


    const razorpay =
      new window.Razorpay(options);


    razorpay.open();

  }





  async function placeOrder(){


    if(!paymentMethod){

      toast.error(
        "Please select payment method."
      );

      return;

    }



    if(!user){

      toast.error(
        "Please login again."
      );

      return;

    }



    try{


      if(paymentMethod==="ONLINE"){

        await startOnlinePayment();

        return;

      }



      await saveOrder(
        "PENDING"
      );


      toast.success(
        "Order placed successfully!"
      );


      router.push(
        "/order-success"
      );


    }
    catch(error){

      console.error(error);

      toast.error(
        "Failed to place order."
      );

    }

  }





  return (

    <div className="panel">


      <h2>
        Payment & Order Summary
      </h2>



      <h3>
        Products
      </h3>



      {products.map((item)=>(
        <div
          key={item.productId}
          style={{
            display:"flex",
            justifyContent:"space-between",
            marginBottom:12
          }}
        >

          <span>
            {item.name} × {item.quantity}
          </span>


          <strong>
            {formatCurrency(
              item.price *
              item.quantity
            )}
          </strong>


        </div>
      ))}



      <hr />


      <h3>
        Total: {formatCurrency(total)}
      </h3>



      <h3 style={{marginTop:25}}>
        Select Payment Method
      </h3>



      <label>
        <input
          type="radio"
          checked={
            paymentMethod==="ONLINE"
          }
          onChange={()=>
            setPaymentMethod("ONLINE")
          }
        />

        {" "}
        Online Payment
        (UPI / Card / Net Banking)

      </label>



      <br />


      <label>
        <input
          type="radio"
          checked={
            paymentMethod==="COD"
          }
          onChange={()=>
            setPaymentMethod("COD")
          }
        />

        {" "}
        Cash on Delivery

      </label>




      <div
        style={{
          display:"flex",
          gap:12,
          marginTop:30
        }}
      >


        <button
          className="button secondary"
          onClick={()=>
            setCheckoutStep(2)
          }
        >
          Back
        </button>



        <button
          className="button primary"
          onClick={placeOrder}
        >
          Place Order
        </button>


      </div>


    </div>

  );

}