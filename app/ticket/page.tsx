import type { Metadata } from "next";
import TicketView from "@/app/components/TicketView";
import { registrationApiUrl } from "@/app/lib/registration-api";

export const metadata: Metadata = {
  title: "Your ticket",
  alternates: { canonical: "/ticket" },
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};
export default function TicketPage() {
  return <TicketView apiUrl={registrationApiUrl} />;
}
