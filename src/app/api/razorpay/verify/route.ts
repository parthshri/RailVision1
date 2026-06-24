import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Razorpay secret is not configured" }, { status: 500 });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not verify payment" }, { status: 500 });
  }
}
