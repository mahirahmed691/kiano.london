import type { Metadata } from "next";
import { InviteForm } from "@/components/invite-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Membership",
};

export default function MembershipPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-margin-mobile pt-32 pb-32 text-center md:px-margin-desktop">
        <p className="mb-4 font-label-caps text-label-caps uppercase tracking-widest text-secondary">
          Membership
        </p>
        <h1 className="mb-8 font-display-lg text-display-lg-mobile text-primary md:text-display-lg">
          The Inner Circle
        </h1>
        <p className="mb-12 font-body-lg text-body-lg text-on-surface-variant">
          Join the Cavendish House membership to receive early access to seasonal collections,
          exclusive bespoke services, and invitations to private events in London.
        </p>
        <InviteForm id="membership-invite" compact />
      </main>
      <SiteFooter />
    </>
  );
}
