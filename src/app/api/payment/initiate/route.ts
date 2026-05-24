import { NextResponse } from "next/server";
import crypto from "crypto";
import type { CartItem } from "@/context/CartContext";

const SANDBOX_BASE = "http://sandbox.api.phicommerce.com";
const INITIATE_SALE_PATH = "/pg/api/v2/initiateSale";

// Sort params alphabetically by key, concatenate values, then HMAC-SHA256 with secret key.
// Phi Commerce docs: "sorts all request parameters in ascending order, concatenates their values,
// and applies SHA-256 encryption using the merchant's secret key."
function generateSecureHash(
  params: Record<string, string>,
  secretKey: string
): string {
  const concatenated = Object.keys(params)
    .sort()
    .map((k) => params[k] ?? "")
    .join("");
  return crypto
    .createHmac("sha256", secretKey)
    .update(concatenated)
    .digest("hex");
}

function generateOrderId(): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `BLS${Date.now()}${rand}`;
}

export async function POST(req: Request) {
  const merchantId = process.env.PHICOMMERCE_MERCHANT_ID;
  const secretKey = process.env.PHICOMMERCE_SECRET_KEY;
  const gatewayBase = process.env.PHICOMMERCE_BASE_URL ?? SANDBOX_BASE;
  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!merchantId || !secretKey) {
    console.error("Phi Commerce credentials not configured in .env.local");
    return NextResponse.json(
      { error: "Payment gateway is not configured." },
      { status: 500 }
    );
  }

  let body: { customer?: unknown; items?: unknown };
  try {
    body = (await req.json()) as { customer?: unknown; items?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const customer = body.customer as {
    name: string;
    email: string;
    phone: string;
    address: string;
  } | null;
  const items = body.items as CartItem[] | null;

  if (
    !customer?.name ||
    !customer?.email ||
    !customer?.phone ||
    !customer?.address ||
    !items?.length
  ) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const merchantTxnNo = generateOrderId();
  const totalAmount = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const amountStr = totalAmount.toFixed(2);

  const udfJson = JSON.stringify({
    address: customer.address,
    items: items.map((i) => ({
      id: i.product.id,
      title: i.product.title,
      qty: i.quantity,
      price: i.product.price,
    })),
  });

  // Build params without secureHash first (hash is computed over these fields)
  const params: Record<string, string> = {
    merchantId,
    merchantTxnNo,
    amount: amountStr,
    currencyCode: "356", // ISO 4217 numeric code for INR
    paymentMode: "ALL",
    customerName: customer.name,
    customerEmailId: customer.email,
    customerMobileNo: customer.phone,
    returnURL: `${appBaseUrl}/order/return`,
    paymentAdviceURL: `${appBaseUrl}/api/payment/advice`,
    udfJson,
  };

  const secureHash = generateSecureHash(params, secretKey);

  const payload = { ...params, secureHash };

  let gwRes: Response;
  try {
    gwRes = await fetch(`${gatewayBase}${INITIATE_SALE_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Phi Commerce network error:", err);
    return NextResponse.json(
      { error: "Unable to reach payment gateway. Please try again." },
      { status: 502 }
    );
  }

  if (!gwRes.ok) {
    const text = await gwRes.text();
    console.error("Phi Commerce error response:", gwRes.status, text);
    return NextResponse.json(
      { error: "Payment gateway returned an error. Please try again." },
      { status: 502 }
    );
  }

  const gwData = (await gwRes.json()) as {
    redirectURI?: string;
    redirect_url?: string;
    responseCode?: string;
    respDescription?: string;
  };

  const redirectUrl = gwData.redirectURI ?? gwData.redirect_url;

  if (!redirectUrl) {
    console.error("No redirectURI in gateway response:", gwData);
    return NextResponse.json(
      {
        error:
          gwData.respDescription ??
          "Unable to initiate payment. Please try again.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ redirectUrl, merchantTxnNo });
}
