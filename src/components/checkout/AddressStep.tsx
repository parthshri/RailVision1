"use client";

import {
  useCheckout,
} from "@/contexts/CheckoutContext";

const INDIAN_STATES_AND_UTS = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const PIN_CODE_REGEX =
  /^[1-9][0-9]{5}$/;

const CITY_REGEX =
  /^[a-zA-Z\s.'-]{2,80}$/;

export default function AddressStep() {
  const {
    shippingAddress,
    setShippingAddress,
    setCheckoutStep,
  } = useCheckout();

  function nextStep() {
    const house =
      shippingAddress.house.trim();

    const street =
      shippingAddress.street.trim();

    const area =
      shippingAddress.area.trim();

    const city =
      shippingAddress.city.trim();

    const state =
      shippingAddress.state.trim();

    const pinCode =
      shippingAddress.pinCode.trim();

    if (!house) {
      alert(
        "Please enter your house or flat number."
      );

      return;
    }

    if (!street) {
      alert(
        "Please enter your street or address."
      );

      return;
    }

    if (
      !CITY_REGEX.test(city)
    ) {
      alert(
        "Please enter a valid city name."
      );

      return;
    }

    if (
      !INDIAN_STATES_AND_UTS.includes(
        state
      )
    ) {
      alert(
        "Please select a valid Indian state or union territory."
      );

      return;
    }

    if (
      !PIN_CODE_REGEX.test(
        pinCode
      )
    ) {
      alert(
        "Please enter a valid 6-digit Indian PIN code."
      );

      return;
    }

    setShippingAddress({
      ...shippingAddress,

      house,
      street,
      area,
      city,
      state,
      pinCode,
      country: "India",
    });

    setCheckoutStep(3);
  }

  return (
    <div>
      <h2>
        Shipping Address
      </h2>

      <p
        style={{
          color:
            "var(--muted)",
          marginBottom: 22,
        }}
      >
        Enter the address where
        you'd like your RailVision
        order delivered.
      </p>

      <label>
        House / Flat Number

        <input
          type="text"
          placeholder="House / Flat Number"
          value={
            shippingAddress.house
          }
          autoComplete="address-line1"
          maxLength={100}
          onChange={(event) =>
            setShippingAddress({
              ...shippingAddress,

              house:
                event.target.value,
            })
          }
        />
      </label>

      <label>
        Street / Address

        <input
          type="text"
          placeholder="Street / Address"
          value={
            shippingAddress.street
          }
          autoComplete="address-line2"
          maxLength={150}
          onChange={(event) =>
            setShippingAddress({
              ...shippingAddress,

              street:
                event.target.value,
            })
          }
        />
      </label>

      <label>
        Area / Locality
        <span
          style={{
            color:
              "var(--muted)",
            fontWeight: 400,
          }}
        >
          {" "}
          (Optional)
        </span>

        <input
          type="text"
          placeholder="Area / Locality"
          value={
            shippingAddress.area
          }
          maxLength={100}
          onChange={(event) =>
            setShippingAddress({
              ...shippingAddress,

              area:
                event.target.value,
            })
          }
        />
      </label>

      <label>
        City

        <input
          type="text"
          placeholder="City"
          value={
            shippingAddress.city
          }
          autoComplete="address-level2"
          maxLength={80}
          onChange={(event) => {
            const value =
              event.target.value.replace(
                /[^a-zA-Z\s.'-]/g,
                ""
              );

            setShippingAddress({
              ...shippingAddress,
              city: value,
            });
          }}
        />
      </label>

      <label>
        State / Union Territory

        <select
          value={
            shippingAddress.state
          }
          autoComplete="address-level1"
          onChange={(event) =>
            setShippingAddress({
              ...shippingAddress,

              state:
                event.target.value,
            })
          }
        >
          <option value="">
            Select State / UT
          </option>

          {INDIAN_STATES_AND_UTS.map(
            (state) => (
              <option
                key={state}
                value={state}
              >
                {state}
              </option>
            )
          )}
        </select>
      </label>

      <label>
        PIN Code

        <input
          type="text"
          inputMode="numeric"
          placeholder="6-digit PIN Code"
          value={
            shippingAddress.pinCode
          }
          autoComplete="postal-code"
          maxLength={6}
          onChange={(event) => {
            const value =
              event.target.value
                .replace(/\D/g, "")
                .slice(0, 6);

            setShippingAddress({
              ...shippingAddress,

              pinCode:
                value,
            });
          }}
        />
      </label>

      <label>
        Country

        <input
          type="text"
          value="India"
          readOnly
          aria-readonly="true"
          autoComplete="country-name"
          style={{
            cursor:
              "not-allowed",
            opacity: 0.8,
          }}
        />
      </label>

      <div
        style={{
          marginTop: 8,
          padding: 14,

          border:
            "1px solid var(--line)",

          borderRadius: 10,

          background:
            "rgba(255,255,255,0.025)",

          color:
            "var(--muted)",

          fontSize: "0.85rem",
        }}
      >
        🇮🇳 RailVision currently
        ships within India only.
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 24,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          className="button secondary"
          onClick={() =>
            setCheckoutStep(1)
          }
        >
          Back
        </button>

        <button
          type="button"
          className="button primary"
          onClick={
            nextStep
          }
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}