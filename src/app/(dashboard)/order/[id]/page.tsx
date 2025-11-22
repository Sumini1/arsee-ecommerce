
import Script from "next/script";
import DetailOrder from "./_components/detail-order";
import { environtment } from "@/configs/environtment";

export const metadata = {
  title: "Arsee Wear| Detail Order",
};

declare global {
  interface Window {
    snap: any;
  }
}

export default async function DetailOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="w-full">
      <Script
        src={`${environtment.MIDTRANS_API_URL}/snap/snap.js`}
        data-client-key={environtment.MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      <DetailOrder id={id} />
    </div>
  );
}
