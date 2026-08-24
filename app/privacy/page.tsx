import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-margin-mobile pt-32 pb-32 md:px-margin-desktop">
        <h1 className="mb-8 font-headline-md text-headline-md text-primary">Privacy</h1>
        <div className="space-y-6 font-body-md text-body-md text-on-surface-variant">
          <p>
            Cavendish House collects only what is required to administer Inner Circle membership,
            enquiries, and bespoke appointments. Email addresses submitted through this site are
            used to respond to your request and to share collection releases you have asked to
            receive.
          </p>
          <p>
            We do not sell personal information. Membership communications can be declined at any
            time by writing to us through the contact page.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
