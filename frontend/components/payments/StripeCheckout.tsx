"use client";

import { useState, useCallback } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

interface StripeCheckoutProps {
  amount: number;
  email: string;
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onClose: () => void;
  currency?: string;
}

function CheckoutForm({
  amount,
  email,
  currency = "USD",
  onSuccess,
  onClose,
}: Omit<StripeCheckoutProps, "clientSecret">) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "An error occurred");
        setIsProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payments/callback`,
          },
          redirect: "if_required",
        });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id);
      } else {
        setError("Payment was not completed");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Amount:</span>
          <span className="font-semibold">
            {currency.toUpperCase()} {amount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Email:</span>
          <span className="font-medium">{email}</span>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="bg-gray-50 rounded-lg p-4">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>Pay {currency.toUpperCase()} {amount.toLocaleString()}</>
          )}
        </Button>
      </div>

      {/* Security Notice */}
      <p className="text-xs text-gray-500 text-center">
        Secured by Stripe. Your payment information is encrypted and secure.
      </p>
    </form>
  );
}

export default function StripeCheckout({
  amount,
  email,
  clientSecret,
  onSuccess,
  onClose,
  currency = "USD",
}: StripeCheckoutProps) {
  const [isComplete, setIsComplete] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  const handleSuccess = useCallback(
    (id: string) => {
      setPaymentIntentId(id);
      setIsComplete(true);
      onSuccess(id);
    },
    [onSuccess]
  );

  if (!clientSecret) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="py-8">
          <div className="text-center text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p>Payment initialization failed. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="py-8">
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              Your payment of {currency.toUpperCase()}{" "}
              {amount.toLocaleString()} has been processed.
            </p>
            {paymentIntentId && (
              <p className="text-sm text-gray-500 mt-2">
                ID: {paymentIntentId}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Pay with Stripe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#3b82f6",
                borderRadius: "8px",
              },
            },
          }}
        >
          <CheckoutForm
            amount={amount}
            email={email}
            currency={currency}
            onSuccess={handleSuccess}
            onClose={onClose}
          />
        </Elements>
      </CardContent>
    </Card>
  );
}
