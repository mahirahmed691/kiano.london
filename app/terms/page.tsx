import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-margin-mobile pt-32 pb-32 md:px-margin-desktop">
        <h1 className="mb-8 font-headline-md text-headline-md text-primary">Terms</h1>
        <div className="space-y-6 font-body-md text-body-md text-on-surface-variant">
          <p>
            Pieces from Cavendish House are offered through Inner Circle membership and private
            appointment. An invite request does not constitute a sale. Availability, pricing, and
            lead times are confirmed in writing before any commission is accepted.
          </p>
          <p>All design, photography, and copy on this site remain the property of Cavendish House.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
