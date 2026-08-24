import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-margin-mobile pt-32 pb-32 md:px-margin-desktop">
        <h1 className="mb-8 font-headline-md text-headline-md text-primary">Shipping</h1>
        <div className="space-y-6 font-body-md text-body-md text-on-surface-variant">
          <p>
            Made pieces are dispatched from London by appointment. Delivery windows are agreed when
            a commission is confirmed. International shipments are arranged individually to protect
            the garment in transit.
          </p>
          <p>Bespoke fittings may be scheduled in London before final dispatch.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
