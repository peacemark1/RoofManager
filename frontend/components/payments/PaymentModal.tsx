"use client";

import { useState } from "react";
import PaystackCheckout from "./PaystackCheckout";
import StripeCheckout from "./StripeCheckout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: "paystack" | "stripe";
  amount: number;
  email: string;
  reference?: string;
  clientSecret?: string;
  currency?: string;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
}

export function PaymentModal({
  open,
  onOpenChange,
  provider,
  amount,
  email,
  reference,
  clientSecret,
  currency = "USD",
  onSuccess,
  onClose,
}: PaymentModalProps) {
  const handleClose = () => {
    onOpenChange(false);
    onClose?.();
  };

  const handleSuccess = (ref: string) => {
    onSuccess(ref);
    // Close modal after a short delay to show success state
    setTimeout(() => {
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {provider === "paystack" ? "Pay with Paystack" : "Pay with Stripe"}
          </DialogTitle>
        </DialogHeader>

        {provider === "paystack" ? (
          <PaystackCheckout
            amount={amount}
            email={email}
            reference={reference || `paystack-${Date.now()}`}
            onSuccess={handleSuccess}
            onClose={handleClose}
            currency={currency}
          />
        ) : (
          <StripeCheckout
            amount={amount}
            email={email}
            clientSecret={clientSecret || ""}
            onSuccess={handleSuccess}
            onClose={handleClose}
            currency={currency}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// Utility hook to manage payment state
export function usePayment(provider: "paystack" | "stripe") {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    amount: number;
    email: string;
    reference?: string;
    clientSecret?: string;
    currency?: string;
  } | null>(null);

  const initiatePayment = (
    amount: number,
    email: string,
    options?: {
      reference?: string;
      clientSecret?: string;
      currency?: string;
    }
  ) => {
    setPaymentData({
      amount,
      email,
      ...options,
    });
    setIsOpen(true);
  };

  return {
    isOpen,
    setIsOpen,
    paymentData,
    initiatePayment,
  };
}
