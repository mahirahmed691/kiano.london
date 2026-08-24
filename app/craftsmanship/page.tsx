import type { Metadata } from "next";
import { CraftsmanshipSections } from "@/components/craftsmanship-sections";

export const metadata: Metadata = {
  title: "The Art of the Stitch",
};

export default function CraftsmanshipPage() {
  return <CraftsmanshipSections showBranding={false} />;
}
