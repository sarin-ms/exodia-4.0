import type { Metadata } from "next";
import TicketView from "@/app/components/TicketView";
import { registrationApiUrl } from "@/app/lib/registration-api";

export const metadata: Metadata = {
  title: "Find your ticket",
  description: "Find your Exodia 4.0 student pass using your registration email. Verify your email to open and download your ticket.",
  alternates: { canonical: "/ticket" },
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};
export default function TicketPage() {
  return <TicketView apiUrl={registrationApiUrl} />;
}
