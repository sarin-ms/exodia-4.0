import type { Metadata } from "next";
import RegistrationForm from "@/app/components/RegistrationForm";
import { registrationApiUrl } from "@/app/lib/registration-api";

export const metadata: Metadata = {
  title: "Student registration",
  description:
    "Choose your learning stack and register for Exodia 4.0. ₹799 per student, for one stack.",
  alternates: { canonical: "/register" },
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return <RegistrationForm apiUrl={registrationApiUrl} />;
}
