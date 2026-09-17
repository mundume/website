"use client";

import { CreditCardIcon, DownloadIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaystackCheckoutButton } from "@/components/dashboard/paystack-checkout-button";

interface BillingActionsProps {
  invoiceId: string;
}

export function DownloadInvoiceButton({ invoiceId }: BillingActionsProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => toast.success(`Downloading ${invoiceId}`)}
    >
      <DownloadIcon className="size-4" />
    </Button>
  );
}

export function ManageSubscriptionButton() {
  return <PaystackCheckoutButton />;
}

export function UpdateCardButton() {
  return (
    <Button
      variant="outline"
      onClick={() => toast.info("Opening billing portal...")}
    >
      Update Card
    </Button>
  );
}

export function CancelSubscriptionButton() {
  return (
    <Button
      variant="destructive"
      onClick={() =>
        toast.error("Subscription cancellation requires confirmation.")
      }
    >
      Cancel subscription
    </Button>
  );
}

export { CreditCardIcon, Badge };
