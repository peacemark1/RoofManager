"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, CheckCircle2 } from "lucide-react";

interface PaystackCheckoutProps {
  amount: number;
  email: string;
  reference: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  currency?: string;
}

export default function PaystackCheckout({
  amount,
  email,
  reference,
  onSuccess,
  onClose,
  currency = "GHS",
}: PaystackCheckoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initializePaystack = useCallback(() => {
    // @ts-ignore - Paystack is loaded via script
    if (typeof window.PaystackPop === "undefined") {
      setError("Paystack library not loaded. Please refresh the page.");
      setIsLoading(false);
      return;
    }

    try {
      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        email,
        amount: Math.round(amount * 100), // Convert to pesewas
        currency,
        ref: reference,
        container: containerRef.current?.id || "paystack-checkout-container",
        onClose: () => {
          if (!isComplete) {
            onClose();
          }
        },
        callback: (response: { reference: string }) => {
          setIsComplete(true);
          setIsProcessing(false);
          onSuccess(response.reference);
        },
      });

      setIsLoading(false);
      return handler;
    } catch (err) {
      console.error("Paystack initialization error:", err);
      setError("Failed to initialize payment. Please try again.");
      setIsLoading(false);
    }
  }, [amount, email, reference, currency, onSuccess, onClose, isComplete]);

  useEffect(() => {
    // Load Paystack inline script
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      initializePaystack();
    };
    script.onerror = () => {
      setError("Failed to load Paystack library.");
      setIsLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector(
        'script[src="https://js.paystack.co/v1/inline.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [initializePaystack]);

  const handleOpenCheckout = () => {
    setIsProcessing(true);
    setError(null);
    // @ts-ignore
    if (window.PaystackPop) {
      initializePaystack();
      // @ts-ignore
      window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        email,
        amount: Math.round(amount * 100),
        currency,
        ref: reference,
        onClose: () => {
          if (!isComplete) {
            setIsProcessing(false);
            onClose();
          }
        },
        callback: (response: { reference: string }) => {
          setIsComplete(true);
          setIsProcessing(false);
          onSuccess(response.reference);
        },
      });
      // @ts-ignore
      window.PaystackPop.openIframe();
    }
  };

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
              Your payment of {currency} {amount.toLocaleString()} has been
              processed.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Reference: {reference}
            </p>
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
          Pay with Paystack
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold">
              {currency} {amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Reference:</span>
            <span className="font-mono text-xs">{reference}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Checkout Container */}
        <div
          id="paystack-checkout-container"
          ref={containerRef}
          className="min-h-[100px] bg-gray-50 rounded-lg flex items-center justify-center"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Initializing payment...</span>
            </div>
          ) : null}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOpenCheckout}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
            disabled={isLoading || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>Pay {currency} {amount.toLocaleString()}</>
            )}
          </Button>
        </div>

        {/* Security Notice */}
        <p className="text-xs text-gray-500 text-center">
          Secured by Paystack. Your payment information is encrypted and secure.
        </p>
      </CardContent>
    </Card>
  );
}
