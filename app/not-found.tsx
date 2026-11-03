import type { Metadata } from "next";
import NotFoundScreen from "@/app/components/NotFoundScreen";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "This page could not be found. Find your way back to Exodia 4.0.",
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundScreen />;
}
