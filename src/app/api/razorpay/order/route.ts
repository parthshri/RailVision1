import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount, receipt } = await request.json();

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay server keys are not configured" },
        { status: 500 }
      );
    }

      console.log("KEY ID =", process.env.RAZORPAY_KEY_ID);
    console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET?.substring(0, 5));
    
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: receipt || `railvision_${Date.now()}`
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not create payment order" }, { status: 500 });
  }
}
