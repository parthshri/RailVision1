"use client";

import {
  useEffect,
} from "react";

import {
  LogIn,
  UserCheck,
} from "lucide-react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  useAuth,
} from "@/contexts/AuthContext";

import {
  useCheckout,
} from "@/contexts/CheckoutContext";

const PHONE_REGEX =
  /^[6-9]\d{9}$/;

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CustomerStep() {
  const {
    customerInfo,
    setCustomerInfo,
    setCheckoutStep,
  } = useCheckout();

  const {
    user,
  } = useAuth();

  const router =
    useRouter();

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  /*
   * Prefill name/email for
   * signed-in customers.
   *
   * Only empty fields are filled,
   * so customers can still change
   * their checkout email or name.
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    setCustomerInfo({
      ...customerInfo,

      fullName:
        customerInfo.fullName ||
        user.displayName ||
        "",

      email:
        customerInfo.email ||
        user.email ||
        "",
    });

    // Only run when auth user changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function openSignIn() {
    const query =
      searchParams.toString();

    const currentCheckoutUrl =
      query
        ? `${pathname}?${query}`
        : pathname;

    router.push(
      `/auth?redirect=${encodeURIComponent(
        currentCheckoutUrl
      )}`
    );
  }

  function nextStep() {
    const fullName =
      customerInfo.fullName.trim();

    const email =
      customerInfo.email
        .trim()
        .toLowerCase();

    const phone =
      customerInfo.phone.trim();

    const alternatePhone =
      customerInfo.alternatePhone.trim();

    /*
     * NAME VALIDATION
     */

    if (
      fullName.length < 2
    ) {
      alert(
        "Please enter your full name."
      );

      return;
    }

    if (
      !/[a-zA-Z]/.test(
        fullName
      )
    ) {
      alert(
        "Please enter a valid full name."
      );

      return;
    }

    /*
     * EMAIL VALIDATION
     */

    if (
      !EMAIL_REGEX.test(
        email
      )
    ) {
      alert(
        "Please enter a valid email address."
      );

      return;
    }

    /*
     * PHONE VALIDATION
     */

    if (
      !PHONE_REGEX.test(
        phone
      )
    ) {
      alert(
        "Please enter a valid 10-digit Indian mobile number."
      );

      return;
    }

    /*
     * ALTERNATE PHONE
     */

    if (
      alternatePhone &&
      !PHONE_REGEX.test(
        alternatePhone
      )
    ) {
      alert(
        "Please enter a valid 10-digit alternate mobile number."
      );

      return;
    }

    if (
      alternatePhone &&
      alternatePhone ===
        phone
    ) {
      alert(
        "Alternate phone number should be different from the primary phone number."
      );

      return;
    }

    /*
     * SAVE CLEAN VALUES
     */

    setCustomerInfo({
      ...customerInfo,

      fullName,
      email,
      phone,
      alternatePhone,
    });

    setCheckoutStep(2);
  }

  return (
    <div>
      <h2>
        Customer Details
      </h2>

      {!user ? (
        <div
          style={{
            margin:
              "18px 0 26px",

            padding: 18,

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap: 18,

            flexWrap:
              "wrap",

            border:
              "1px solid var(--line)",

            borderRadius:
              14,

            background:
              "rgba(255, 255, 255, 0.035)",
          }}
        >
          <div
            style={{
              flex:
                "1 1 240px",
            }}
          >
            <strong
              style={{
                display:
                  "block",

                marginBottom:
                  5,

                fontSize:
                  "1rem",
              }}
            >
              Already have a
              RailVision account?
            </strong>

            <p
              style={{
                margin: 0,

                color:
                  "var(--muted)",

                fontSize:
                  "0.88rem",

                lineHeight:
                  1.5,
              }}
            >
              Sign in to autofill
              your account details,
              or continue below as
              a guest.
            </p>
          </div>

          <button
            type="button"
            className="button secondary"
            onClick={
              openSignIn
            }
          >
            <LogIn
              size={18}
            />

            Sign In
          </button>
        </div>
      ) : (
        <div
          style={{
            margin:
              "18px 0 26px",

            padding: 16,

            display: "flex",

            alignItems:
              "center",

            gap: 11,

            border:
              "1px solid rgba(82, 217, 150, 0.3)",

            borderRadius:
              14,

            background:
              "rgba(82, 217, 150, 0.065)",
          }}
        >
          <UserCheck
            size={21}
            style={{
              color:
                "var(--green)",

              flexShrink: 0,
            }}
          />

          <div>
            <strong
              style={{
                display:
                  "block",
              }}
            >
              Signed in
            </strong>

            {user.email ? (
              <span
                style={{
                  color:
                    "var(--muted)",

                  fontSize:
                    "0.86rem",
                }}
              >
                {user.email}
              </span>
            ) : null}
          </div>
        </div>
      )}

      <label>
        Full Name

        <input
          type="text"
          placeholder="Full Name"
          value={
            customerInfo.fullName
          }
          autoComplete="name"
          maxLength={80}
          onChange={(
            event
          ) => {
            setCustomerInfo({
              ...customerInfo,

              fullName:
                event.target.value,
            });
          }}
        />
      </label>

      <label>
        Email Address

        <input
          type="email"
          placeholder="Email address"
          value={
            customerInfo.email
          }
          autoComplete="email"
          maxLength={120}
          onChange={(
            event
          ) => {
            setCustomerInfo({
              ...customerInfo,

              email:
                event.target.value,
            });
          }}
        />
      </label>

      <p
        style={{
          margin:
            "-4px 0 16px",

          color:
            "var(--muted)",

          fontSize:
            "0.8rem",

          lineHeight:
            1.45,
        }}
      >
        Order confirmation and
        delivery updates will be
        sent to this email. You
        can change it even if
        you're signed in.
      </p>

      <label>
        Phone Number

        <input
          type="tel"
          inputMode="numeric"
          placeholder="10-digit Indian mobile number"
          value={
            customerInfo.phone
          }
          autoComplete="tel"
          maxLength={10}
          onChange={(
            event
          ) => {
            const value =
              event.target.value
                .replace(
                  /\D/g,
                  ""
                )
                .slice(
                  0,
                  10
                );

            setCustomerInfo({
              ...customerInfo,

              phone:
                value,
            });
          }}
        />
      </label>

      <label>
        Alternate Phone
        (Optional)

        <input
          type="tel"
          inputMode="numeric"
          placeholder="10-digit alternate number"
          value={
            customerInfo
              .alternatePhone
          }
          autoComplete="tel"
          maxLength={10}
          onChange={(
            event
          ) => {
            const value =
              event.target.value
                .replace(
                  /\D/g,
                  ""
                )
                .slice(
                  0,
                  10
                );

            setCustomerInfo({
              ...customerInfo,

              alternatePhone:
                value,
            });
          }}
        />
      </label>

      <button
        type="button"
        className="button primary"
        style={{
          marginTop: 20,
        }}
        onClick={
          nextStep
        }
      >
        Continue to Address
      </button>
    </div>
  );
}