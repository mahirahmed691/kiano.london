import type { Metadata } from "next";
import { CraftsmanshipSections } from "@/components/craftsmanship-sections";

export const metadata: Metadata = {
  title: "Physical Branding",
};

export default function CraftsmanshipDetailsPage() {
  return <CraftsmanshipSections showBranding />;
}
