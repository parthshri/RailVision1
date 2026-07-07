"use client";

import {
  collection,
  onSnapshot,
  query,
  where
} from "firebase/firestore";

import Link from "next/link";

import {
  useEffect,
  useState
} from "react";

import {
  LogOut,
  PackageCheck
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

import { db } from "@/lib/firebase";

import { formatCurrency } from "@/lib/products";



type OrderStatus =
  | "PLACED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";



type Order = {

  id:string;

  total:number;

  orderStatus:OrderStatus;

  paymentStatus:string;

  products?:{
    name:string;
    quantity:number;
    price:number;
  }[];

};



export default function ProfilePage(){


  const {
    user,
    loading,
    logout
  } = useAuth();



  const [orders,setOrders] =
    useState<Order[]>([]);



  useEffect(()=>{


    if(!user || !db)
      return;



    const ordersQuery =
      query(
        collection(db,"orders"),
        where(
          "userId",
          "==",
          user.uid
        )
      );



    return onSnapshot(
      ordersQuery,
      snapshot=>{

        setOrders(
          snapshot.docs.map(doc=>({

            id:doc.id,

            ...doc.data()

          } as Order))
        );

      }
    );


  },[user]);






  if(loading){

    return (
      <section className="auth-screen">
        <div className="skeleton profile-skeleton"/>
      </section>
    );

  }





  if(!user){

    return (

      <section className="auth-screen">

        <div className="panel empty-state">

          <h1>
            Please login to view your profile.
          </h1>


          <Link
            className="button primary"
            href="/auth"
          >
            Login
          </Link>

        </div>

      </section>

    );

  }






  return (

    <>


      <section className="subhero">


        <span className="eyebrow">
          User profile
        </span>


        <h1>
          {user.displayName || "RailVision customer"}
        </h1>


        <p>
          {user.email}
        </p>



        <button
          className="button secondary"
          onClick={logout}
        >

          <LogOut size={18}/>

          Logout

        </button>


      </section>







      <section className="section">


        <div className="section-heading">

          <span className="eyebrow">
            Order history
          </span>


          <h2>
            Your RailVision orders.
          </h2>


        </div>







        <div className="order-list">


        {
          orders.length===0 ? (

            <div className="panel empty-state">

              <PackageCheck size={34}/>

              <h3>
                No orders yet.
              </h3>

              <p>
                Your confirmed orders will appear here.
              </p>


            </div>


          ) : (


            orders.map(order=>(


              <article
                className="order-card"
                key={order.id}
              >


                <div>


                  <h3>
                    Order #{order.id.slice(0,8).toUpperCase()}
                  </h3>



                  {
                    order.products?.map(
                      item=>(
                        <p key={item.name}>
                          {item.name}
                          {" × "}
                          {item.quantity}
                        </p>
                      )
                    )
                  }



                  <p>
                    Payment:
                    {" "}
                    {order.paymentStatus}
                  </p>


                </div>




                <div>


                  <strong>
                    {formatCurrency(order.total)}
                  </strong>



                  <StatusTracker
                    status={
                      order.orderStatus || "PLACED"
                    }
                  />

                </div>



              </article>


            ))

          )
        }


        </div>


      </section>


    </>

  );

}







function StatusTracker({
  status
}:{
  status:OrderStatus;
}){


  const steps=[
    "PLACED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED"
  ];



  const current =
    steps.indexOf(status);



  return (

    <div
      style={{
        marginTop:15
      }}
    >


      {
        steps.map(
          (step,index)=>(


            <p
              key={step}
              style={{
                fontWeight:
                  index<=current
                  ?800
                  :400
              }}
            >

              {
                index<=current
                ? "✓"
                : "○"
              }

              {" "}

              {step}

            </p>


          )
        )
      }


    </div>

  );

}