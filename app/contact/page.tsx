"use client";

import { FormEvent, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-container-max px-margin-mobile pt-32 pb-32 md:px-margin-desktop">
        <p className="mb-4 font-label-caps text-label-caps uppercase tracking-widest text-secondary">
          Correspondence
        </p>
        <h1 className="mb-8 font-display-lg text-display-lg-mobile text-primary md:text-display-lg">
          Contact
        </h1>
        <p className="mb-16 max-w-xl font-body-lg text-body-lg text-on-surface-variant">
          Private appointments, membership enquiries, and atelier visits are arranged by
          correspondence.
        </p>
        {sent ? (
          <p
            className="max-w-xl border-b border-primary py-4 font-body-md text-body-md text-primary"
            data-testid="contact-success"
          >
            Thank you. The house will reply in due course.
          </p>
        ) : (
          <form className="max-w-xl space-y-8" onSubmit={onSubmit}>
            <div>
              <label
                className="mb-3 block font-label-caps text-label-caps uppercase tracking-widest text-primary"
                htmlFor="name"
              >
                Name
              </label>
              <input
                id="name"
                required
                className="w-full rounded-none border-0 border-b border-primary/20 bg-transparent py-3 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label
                className="mb-3 block font-label-caps text-label-caps uppercase tracking-widest text-primary"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full rounded-none border-0 border-b border-primary/20 bg-transparent py-3 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label
                className="mb-3 block font-label-caps text-label-caps uppercase tracking-widest text-primary"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                className="w-full rounded-none border-0 border-b border-primary/20 bg-transparent py-3 outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="bg-primary px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest text-on-primary hover:bg-primary/90"
            >
              Send
            </button>
          </form>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
