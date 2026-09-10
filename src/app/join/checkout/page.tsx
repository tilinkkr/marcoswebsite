import type { Metadata } from "next";

import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your MARCOS details, risk acknowledgement and manual payment submission.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const params = await searchParams;
  const productKind =
    params.product === "indicator" ? "indicator" : "membership";
  const qrAsset =
    process.env.PAYMENT_QR_ASSET ?? "/images/payments/marcos-upi-qr.png";
  return <CheckoutFlow productKind={productKind} qrAsset={qrAsset} />;
}
