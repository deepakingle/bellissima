import Link from "next/link";
import Container from "@/components/layout/Container";
import CartClearer from "@/components/cart/CartClearer";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

function param(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default function OrderReturnPage({ searchParams }: Props) {
  const responseCode = param(searchParams.responseCode);
  const merchantTxnNo = param(searchParams.merchantTxnNo);
  const txnID = param(searchParams.txnID);
  const amount = param(searchParams.amount);
  const respDescription = param(searchParams.respDescription);

  const success = responseCode === "0000";

  return (
    <div className="py-16">
      <Container>
        {success && <CartClearer />}

        <div className="max-w-lg mx-auto rounded-3xl border border-neutral-200/70 bg-white/70 p-10 text-center shadow-sm">
          {success ? (
            <>
              <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-neutral-900">
                Payment Successful!
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                Thank you for your order. We&apos;ll confirm the details
                shortly via email.
              </p>
              {amount && (
                <p className="mt-4 text-xl font-semibold text-neutral-900">
                  ₹{parseFloat(amount).toFixed(0)} paid
                </p>
              )}
              {merchantTxnNo && (
                <p className="mt-2 text-xs text-neutral-500">
                  Order ID: {merchantTxnNo}
                </p>
              )}
              {txnID && (
                <p className="text-xs text-neutral-500">
                  Transaction ID: {txnID}
                </p>
              )}
              <Link
                href="/"
                className="mt-8 inline-flex rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-[#ead9d4] px-8 py-3 text-sm font-semibold text-neutral-900 hover:shadow-sm transition-all"
              >
                Continue Shopping
              </Link>
            </>
          ) : (
            <>
              <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-neutral-900">
                Payment Failed
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                {respDescription ||
                  (responseCode
                    ? `Error code: ${responseCode}`
                    : "Something went wrong with your payment.")}
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                Your cart has been saved. You can try again.
              </p>
              {merchantTxnNo && (
                <p className="mt-3 text-xs text-neutral-500">
                  Reference: {merchantTxnNo}
                </p>
              )}
              <div className="mt-8 flex gap-3 justify-center">
                <Link
                  href="/checkout"
                  className="rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-[#ead9d4] px-6 py-3 text-sm font-semibold text-neutral-900 hover:shadow-sm transition-all"
                >
                  Try Again
                </Link>
                <Link
                  href="/cart"
                  className="rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  View Cart
                </Link>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
