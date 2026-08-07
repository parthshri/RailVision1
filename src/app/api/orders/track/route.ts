import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  adminDb,
} from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX =
  /^[6-9]\d{9}$/;

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const orderId =
      String(
        body.orderId || ""
      ).trim();

    const email =
      String(
        body.email || ""
      )
        .trim()
        .toLowerCase();

    const phone =
      String(
        body.phone || ""
      )
        .trim()
        .replace(/\D/g, "");

    /*
     * BASIC INPUT VALIDATION
     */

    if (!orderId) {
      return NextResponse.json(
        {
          error:
            "Order ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      orderId.length > 100
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid Order ID.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !email &&
      !phone
    ) {
      return NextResponse.json(
        {
          error:
            "Enter the order email or phone number.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      email &&
      !EMAIL_REGEX.test(email)
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      phone &&
      !PHONE_REGEX.test(phone)
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a valid 10-digit Indian mobile number.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * FETCH ORDER USING ADMIN SDK
     *
     * This does NOT expose Firestore
     * directly to the guest.
     */

    const orderSnapshot =
      await adminDb
        .collection("orders")
        .doc(orderId)
        .get();

    if (
      !orderSnapshot.exists
    ) {
      return NextResponse.json(
        {
          error:
            "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    const order =
      orderSnapshot.data();

    if (!order) {
      return NextResponse.json(
        {
          error:
            "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * VERIFY CUSTOMER
     */

    const orderEmail =
      String(
        order.customerInfo
          ?.email || ""
      )
        .trim()
        .toLowerCase();

    const orderPhone =
      String(
        order.customerInfo
          ?.phone || ""
      )
        .trim()
        .replace(/\D/g, "");

    const emailMatches =
      Boolean(email) &&
      email === orderEmail;

    const phoneMatches =
      Boolean(phone) &&
      phone === orderPhone;

    if (
      !emailMatches &&
      !phoneMatches
    ) {
      return NextResponse.json(
        {
          error:
            "The details do not match this order.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * CLEAN PRODUCT DATA
     */

    const products =
      Array.isArray(
        order.products
      )
        ? order.products
            .map(
              (
                item: {
                  productId?: unknown;
                  name?: unknown;
                  quantity?: unknown;
                  price?: unknown;
                }
              ) => {
                const productId =
                  String(
                    item.productId ||
                      ""
                  ).trim();

                const name =
                  String(
                    item.name ||
                      "Product"
                  ).trim();

                const quantity =
                  Math.max(
                    1,
                    Number(
                      item.quantity ||
                        1
                    )
                  );

                const price =
                  Math.max(
                    0,
                    Number(
                      item.price ||
                        0
                    )
                  );

                return {
                  productId,
                  name,
                  quantity,
                  price,
                };
              }
            )
            .filter(
              (item) =>
                Boolean(
                  item.productId
                )
            )
        : [];

    /*
     * SAFE TRACKING RESPONSE
     *
     * Do not return:
     * - full address
     * - phone
     * - email
     * - account UID
     * - affiliate data
     */

    return NextResponse.json({
      order: {
        id:
          orderSnapshot.id,

        orderStatus:
          order.orderStatus ||
          "PLACED",

        paymentMethod:
          order.paymentMethod ||
          "",

        paymentStatus:
          order.paymentStatus ||
          "PENDING",

        total:
          Number(
            order.total || 0
          ),

        products,

        estimatedDelivery:
  order.estimatedDelivery ||
  "To be updated",

        createdAt:
          order.createdAt
            ?.toDate?.()
            ?.toISOString?.() ||
          null,
      },
    });
  } catch (error) {
    console.error(
      "Order tracking failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Could not retrieve the order.",
      },
      {
        status: 500,
      }
    );
  }
}