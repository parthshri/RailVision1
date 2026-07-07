"use client";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc
} from "firebase/firestore";

import {
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";

import Link from "next/link";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState
} from "react";

import toast from "react-hot-toast";

import {
  BarChart3,
  ImageUp,
  Mail,
  Package,
  UsersRound
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

import {
  db,
  storage
} from "@/lib/firebase";

import {
  formatCurrency,
  products
} from "@/lib/products";

import {
  updateOrderStatus
} from "@/lib/firestoreActions";

type AdminOrder = FirestoreDoc & {
  customerInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };

  shippingAddress?: {
    house?: string;
    street?: string;
    area?: string;
    city?: string;
    state?: string;
    pinCode?: string;
  };

  products?: {
    name: string;
    quantity: number;
    price: number;
  }[];

  total?: number;

  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: OrderStatus;
};

type FirestoreDoc =
  Record<string, unknown> & {
    id: string;
  };



type OrderStatus =
  | "PLACED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";




export default function AdminPage() {


  const {
    user,
    isAdmin,
    loading
  } = useAuth();



  const [orders,setOrders] =
    useState<FirestoreDoc[]>([]);


  const [contacts,setContacts] =
    useState<FirestoreDoc[]>([]);


  const [inquiries,setInquiries] =
    useState<FirestoreDoc[]>([]);


  const [customers,setCustomers] =
    useState<FirestoreDoc[]>([]);

    const [selectedOrder, setSelectedOrder] =
      useState<AdminOrder | null>(null);

  const [uploading,setUploading] =
    useState(false);





  useEffect(()=>{


    if(!isAdmin || !db)
      return;



    const unsubscribers = [


      onSnapshot(
        query(
          collection(db,"orders"),
          orderBy("createdAt","desc")
        ),

        snapshot =>
          setOrders(
            snapshot.docs.map(document=>({
              id:document.id,
              ...document.data()
            }))
          )
      ),



      onSnapshot(
        query(
          collection(db,"contacts"),
          orderBy("createdAt","desc")
        ),

        snapshot =>
          setContacts(
            snapshot.docs.map(document=>({
              id:document.id,
              ...document.data()
            }))
          )
      ),



      onSnapshot(
        query(
          collection(db,"proInquiries"),
          orderBy("createdAt","desc")
        ),

        snapshot =>
          setInquiries(
            snapshot.docs.map(document=>({
              id:document.id,
              ...document.data()
            }))
          )
      ),



      onSnapshot(
        collection(db,"users"),

        snapshot =>
          setCustomers(
            snapshot.docs.map(document=>({
              id:document.id,
              ...document.data()
            }))
          )
      )


    ];



    return () =>
      unsubscribers.forEach(
        unsubscribe=>unsubscribe()
      );


  },[isAdmin]);






  const revenue =
    useMemo(
      () =>
        orders.reduce(
          (sum,order)=>
            sum +
            Number(order.total || 0),
          0
        ),

      [orders]
    );







  async function changeOrderStatus(
    orderId:string,
    status:OrderStatus
  ){

    try{

      await updateOrderStatus(
        orderId,
        status
      );


      toast.success(
        "Order status updated"
      );


    }
    catch(error){

      console.error(error);

      toast.error(
        "Failed to update status"
      );

    }

  }







  async function uploadImage(
    event:FormEvent<HTMLFormElement>
  ){

    event.preventDefault();


    const form =
      new FormData(
        event.currentTarget
      );


    const productId =
      String(
        form.get("productId")
      );


    const file =
      form.get("image");



    if(!(file instanceof File) || !file.size){

      toast.error(
        "Choose an image first."
      );

      return;

    }



    if(!db || !storage){

      toast.error(
        "Firebase is not configured yet."
      );

      return;

    }



    setUploading(true);


    try{


      const imageRef =
        ref(
          storage,
          `product-images/${productId}/${Date.now()}-${file.name}`
        );



      await uploadBytes(
        imageRef,
        file
      );



      const imageUrl =
        await getDownloadURL(
          imageRef
        );



      await setDoc(
        doc(
          db,
          "products",
          productId
        ),
        {
          imageUrl
        },
        {
          merge:true
        }
      );



      event.currentTarget.reset();


      toast.success(
        "Product image updated."
      );


    }
    catch{

      toast.error(
        "Upload failed."
      );

    }
    finally{

      setUploading(false);

    }

  }







  if(loading){

    return (
      <section className="auth-screen">
        <div className="skeleton profile-skeleton"/>
      </section>
    );

  }






  if(!user || !isAdmin){

    return (

      <section className="auth-screen">

        <div className="panel empty-state">

          <h1>
            Admin access required.
          </h1>

          <p>
            Login with an email listed in NEXT_PUBLIC_ADMIN_EMAILS.
          </p>


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
          Admin dashboard
        </span>


        <h1>
          Operate RailVision commerce, inquiries, customers, and analytics.
        </h1>


        <p>
          Manage products, customers, orders and order status.
        </p>


      </section>






      <section className="section analytics-grid">


        {[
          {
            icon:BarChart3,
            label:"Sales",
            value:formatCurrency(revenue)
          },

          {
            icon:Package,
            label:"Orders",
            value:String(orders.length)
          },

          {
            icon:UsersRound,
            label:"Customers",
            value:String(customers.length)
          },

          {
            icon:Mail,
            label:"Pro inquiries",
            value:String(inquiries.length)
          }

        ].map(metric=>(


          <div
            className="stat-card"
            key={metric.label}
          >

            <metric.icon size={28}/>

            <span>
              {metric.value}
            </span>

            <p>
              {metric.label}
            </p>

          </div>


        ))}


      </section>






      <section className="section split">


        <div>

          <span className="eyebrow">
            Manage products
          </span>


          <h2>
            Upload replaceable product images.
          </h2>


          <p>
            Images are stored in Firebase Storage.
          </p>


        </div>





        <form
          className="panel form-grid single"
          onSubmit={uploadImage}
        >


          <label>

            Product

            <select name="productId">

              {products.map(product=>(

                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                </option>

              ))}


            </select>

          </label>





          <label>

            Product image

            <input
              required
              type="file"
              name="image"
              accept="image/*"
            />

          </label>




          <button
            className="button primary"
            disabled={uploading}
          >

            <ImageUp size={18}/>

            {
              uploading
              ?"Uploading..."
              :"Upload Image"
            }

          </button>


        </form>


      </section>






      <section className="section admin-tables">


      <OrderAdminList
        orders={orders}
        onStatusChange={changeOrderStatus}
        onSelectOrder={setSelectedOrder}
      />
      {selectedOrder && (

<div
className="panel"
style={{
marginTop:20,
display:"flex",
flexDirection:"column",
gap:12
}}
>

<h2>
Order Details
</h2>


<p>
<strong>Order ID:</strong>{" "}
{selectedOrder.id}
</p>


<hr/>


<h3>
Customer Details
</h3>

<p>
Name: {selectedOrder.customerInfo?.fullName || "-"}
</p>

<p>
Email: {selectedOrder.customerInfo?.email || "-"}
</p>

<p>
Phone: {selectedOrder.customerInfo?.phone || "-"}
</p>


<hr/>


<h3>
Shipping Address
</h3>

<p>
{
selectedOrder.shippingAddress
?
`${selectedOrder.shippingAddress.house}, 
${selectedOrder.shippingAddress.street}, 
${selectedOrder.shippingAddress.area}, 
${selectedOrder.shippingAddress.city}, 
${selectedOrder.shippingAddress.state} - 
${selectedOrder.shippingAddress.pinCode}`
:
"-"
}
</p>


<hr/>


<h3>
Products
</h3>


{
selectedOrder.products?.map(
(product,index)=>(

<div
key={index}
style={{
display:"flex",
justifyContent:"space-between"
}}
>

<span>
{product.name} × {product.quantity}
</span>


<span>
₹{product.price * product.quantity}
</span>

</div>

))
}


<hr/>


<h3>
Payment
</h3>


<p>
Method: {selectedOrder.paymentMethod}
</p>


<p>
Status: {selectedOrder.paymentStatus}
</p>


<p>
Total: ₹{selectedOrder.total}
</p>


<button
className="button secondary"
onClick={() => setSelectedOrder(null)}
>
Close
</button>


</div>

)}


        <AdminList
          title="Customers"
          items={customers}
          fields={["email","name"]}
        />



        <AdminList
          title="RailVision Pro inquiries"
          items={inquiries}
          fields={["email","company","fleetSize"]}
        />



        <AdminList
          title="Contact messages"
          items={contacts}
          fields={["email","subject","message"]}
        />


      </section>

      {
selectedOrder && (

<section className="section">

<div className="panel">

<h2>
Order Details
</h2>

{selectedOrder && (
  <h1>
    ORDER SELECTED
  </h1>
)}

<h3>
Customer Information
</h3>

<p>
Name: {
String(
(selectedOrder.customerInfo as any)?.fullName || "-"
)
}
</p>

<p>
Email: {
String(
(selectedOrder.customerInfo as any)?.email || "-"
)
}
</p>

<p>
Phone: {
String(
(selectedOrder.customerInfo as any)?.phone || "-"
)
}
</p>



<h3>
Shipping Address
</h3>

<p>
{
String(
(selectedOrder.shippingAddress as any)?.house || ""
)
}
{" "}
{
String(
(selectedOrder.shippingAddress as any)?.street || ""
)
}
</p>


<p>
{
String(
(selectedOrder.shippingAddress as any)?.area || ""
)
}
{" "}
{
String(
(selectedOrder.shippingAddress as any)?.city || ""
)
}
{" "}
{
String(
(selectedOrder.shippingAddress as any)?.state || ""
)
}
-
{
String(
(selectedOrder.shippingAddress as any)?.pinCode || ""
)
}
</p>




<h3>
Products
</h3>


{
Array.isArray(selectedOrder.products) &&
selectedOrder.products.map(
(product:any)=>(
<div key={product.productId}>

<p>
<strong>
{product.name}
</strong>
</p>

<p>
Quantity:
{" "}
{product.quantity}
</p>

<p>
Price:
₹{product.price}
</p>

<hr/>

</div>
)
)
}




<h3>
Payment Details
</h3>

<p>
Method:
{" "}
{String(selectedOrder.paymentMethod || "-")}
</p>


<p>
Payment Status:
{" "}
{String(selectedOrder.paymentStatus || "-")}
</p>


<h3>
Total:
₹{String(selectedOrder.total || 0)}
</h3>



<button
className="button secondary"
onClick={()=>setSelectedOrder(null)}
>
Close
</button>


</div>

</section>

)
}
    </>

  );

}









function OrderAdminList({
  orders,
  onStatusChange,
  onSelectOrder
}:{
  onSelectOrder:
(order:FirestoreDoc)=>void;
 orders:AdminOrder[];
  onStatusChange:
    (
      orderId:string,
      status:OrderStatus
    )=>Promise<void>;
}){


  async function handleStatusChange(
    orderId:string,
    status:OrderStatus
  ){

    await onStatusChange(
      orderId,
      status
    );

  }



  return (

    <article className="admin-list">


      <h2>
        Orders
      </h2>



      {
        orders.length===0 &&
        <p>
          No orders yet.
        </p>
      }




      {
        orders.map(order=>(


<div
  className="admin-row"
  key={order.id}
  style={{
    display:"flex",
    flexDirection:"column",
    gap:"10px",
    cursor:"pointer"
  }}
  onClick={() => {
  onSelectOrder(order);
}}
>


            <strong>
              Order #{order.id.slice(0,8)}
            </strong>



            <span>
              Customer:
              {" "}
              {String(
                order.customerInfo &&
                typeof order.customerInfo === "object" &&
                "email" in order.customerInfo
                  ? order.customerInfo.email
                  : "-"
              )}
            </span>



            <span>
              Total:
              {" "}
              ₹{String(order.total ?? 0)}
            </span>



            <span>
              Payment:
              {" "}
              {String(order.paymentMethod ?? "-")}
            </span>



<select
  value={String(order.orderStatus ?? "PLACED")}
  onClick={(e)=>e.stopPropagation()}
  onChange={(e)=>
    handleStatusChange(
      order.id,
      e.target.value as OrderStatus
    )
  }

            >

              <option value="PLACED">
                New Order
              </option>

              <option value="PROCESSING">
                Processing
              </option>

              <option value="SHIPPED">
                Shipped
              </option>

              <option value="DELIVERED">
                Delivered
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>


            </select>


          </div>


        ))
      }



    </article>

  );

}








function AdminList({
  title,
  items,
  fields
}:{
  title:string;
  items:FirestoreDoc[];
  fields:string[];
}){


  return (

    <article className="admin-list">


      <h2>
        {title}
      </h2>



      {
        items.length===0 &&
        <p>
          No records yet.
        </p>
      }




      {
        items.slice(0,8).map(item=>(


          <div
            className="admin-row"
            key={item.id}
          >


            <strong>
              {item.id.slice(0,8)}
            </strong>



            {
              fields.map(field=>(

                <span key={field}>
                  {String(item[field] ?? "-")}
                </span>

              ))
            }



          </div>


        ))
      }



    </article>

  );

}