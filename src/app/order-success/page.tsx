import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <section className="section">

      <div className="panel">

        <h1>
          Order Placed Successfully 🎉
        </h1>

        <p>
          Thank you for ordering from RailVision.
        </p>

        <p>
          Your order has been received and is being processed.
        </p>

        <Link
          href="/"
          className="button primary"
          style={{
            marginTop: 20,
            display: "inline-flex"
          }}
        >
          Continue Shopping
        </Link>

      </div>

    </section>
  );
}