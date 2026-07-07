"use client";

type CheckoutProgressProps = {
  currentStep: number;
};

const steps = [
  "Customer Details",
  "Shipping Address",
  "Payment",
];

export function CheckoutProgress({
  currentStep,
}: CheckoutProgressProps) {
  return (
    <div className="checkout-progress">
      {steps.map((step, index) => {
        const active = currentStep >= index + 1;

        return (
          <div
            key={step}
            className={`progress-step ${
              active ? "active" : ""
            }`}
          >
            <div className="progress-circle">
              {index + 1}
            </div>

            <span>{step}</span>

            {index !== steps.length - 1 && (
              <div className="progress-line" />
            )}
          </div>
        );
      })}
    </div>
  );
}