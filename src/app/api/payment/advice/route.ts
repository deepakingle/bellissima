import { NextResponse } from "next/server";
import crypto from "crypto";

function verifyHash(
  params: Record<string, string>,
  secretKey: string,
  receivedHash: string
): boolean {
  const filtered = { ...params };
  delete filtered.secureHash;

  const concatenated = Object.keys(filtered)
    .sort()
    .map((k) => filtered[k] ?? "")
    .join("");

  const expected = crypto
    .createHmac("sha256", secretKey)
    .update(concatenated)
    .digest("hex");

  return expected === receivedHash;
}

// Phi Commerce sends a server-to-server POST after each payment.
// Respond with HTTP 200 to acknowledge receipt; non-200 triggers a retry.
export async function POST(req: Request) {
  const secretKey = process.env.PHICOMMERCE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  let advice: Record<string, string>;
  const contentType = req.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      advice = (await req.json()) as Record<string, string>;
    } else {
      const text = await req.text();
      advice = Object.fromEntries(new URLSearchParams(text).entries());
    }
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { secureHash, responseCode, merchantTxnNo, txnID, amount } = advice;

  // Verify hash integrity when present
  if (secureHash && !verifyHash(advice, secretKey, secureHash)) {
    console.error(
      "[payment/advice] Hash mismatch for merchantTxnNo:",
      merchantTxnNo
    );
    return NextResponse.json({ ok: false, error: "Hash mismatch" }, { status: 400 });
  }

  const success = responseCode === "0000";
  console.log(
    `[payment/advice] txn=${merchantTxnNo} gwTxnId=${txnID} amount=${amount} success=${success} code=${responseCode}`
  );

  // TODO: persist order status to your database here using merchantTxnNo + responseCode

  return NextResponse.json({ ok: true });
}
