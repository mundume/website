import { NextResponse } from "next/server";

import { isValidPaystackSignature } from "@/lib/billing/paystack";
import { recordSuccessfulPayment } from "@/lib/billing/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();

  try {
    if (!isValidPaystackSignature(rawBody, request.headers.get("x-paystack-signature"))) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Webhook configuration is incomplete." }, { status: 500 });
  }

  try {
    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: {
        reference?: string;
        status?: string;
        amount?: number;
        currency?: string;
        paid_at?: string | null;
        metadata?: { userId?: string; interval?: "monthly" | "annually" };
      };
    };

    if (
      event.event === "charge.success" &&
      event.data?.status === "success" &&
      event.data.reference &&
      event.data.metadata?.userId &&
      event.data.currency === "KES" &&
      typeof event.data.amount === "number"
    ) {
      recordSuccessfulPayment({
        reference: event.data.reference,
        userId: event.data.metadata.userId,
        amount: event.data.amount,
        currency: event.data.currency,
        paidAt: event.data.paid_at ?? null,
        interval: event.data.metadata.interval === "annually" ? "annually" : "monthly",
      });
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }
}
