"use client";

import { FormEvent, useState } from "react";

type InviteFormProps = {
  id?: string;
  compact?: boolean;
};

export function InviteForm({ id = "invite-form", compact = false }: InviteFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="font-sans text-body-md text-primary"
        data-testid="invite-success"
      >
        Invite requested for {email}. We will write when the next collection is released.
      </p>
    );
  }

  return (
    <form
      id={id}
      onSubmit={onSubmit}
      className={
        compact
          ? "flex flex-col gap-4"
          : "mt-8 flex flex-col justify-center gap-4 md:flex-row"
      }
    >
      <label className="sr-only" htmlFor={`${id}-email`}>
        Your Email Address
      </label>
      <input
        id={`${id}-email`}
        required
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your Email Address"
        className="w-full rounded-none border-0 border-b border-primary/20 bg-transparent px-0 py-3 font-sans text-body-md text-primary outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary md:w-80"
      />
      <button
        type="submit"
        className="bg-primary px-8 py-4 font-label-caps uppercase tracking-widest text-on-primary transition-colors hover:bg-primary/90"
      >
        Request Invite
      </button>
    </form>
  );
}
