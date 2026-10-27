import { stacks } from "@/app/content/stacks";

// Display fallback only. The Worker owns the amount used for orders and verification.
export const registrationPrice = 79_900;
export const studyYears = ["1", "2", "3", "4"] as const;
export const yearLabels: Record<string, string> = {
  "1": "1st year",
  "2": "2nd year",
  "3": "3rd year",
  "4": "4th year",
};

export type StudentDetails = {
  name: string;
  college: string;
  year: string;
  email: string;
  phone: string;
  gender: string;
  food: string;
  stackId: string;
};
export type FieldErrors = Partial<Record<keyof StudentDetails, string>>;
export type RegistrationStatus =
  | "pending_payment"
  | "confirmed"
  | "expired"
  | "paid_exception"
  | "refunded";
export type Catalogue = {
  paymentMode: "test" | "live";
  emailReady: boolean;
  salesOpen: boolean;
  message: string;
  stacks: { id: string; title: string; amount: number; available: boolean }[];
};
export type Checkout = {
  registrationId: string;
  reference: string;
  status: RegistrationStatus;
  orderState: string;
  orderId: string | null;
  amount: number;
  currency: "INR";
  expiresAt: number;
  keyId: string;
  paymentMode: "test" | "live";
  ticketUrl?: string;
  ticketEmailStatus?: string;
};

export type EmailVerification = {
  verificationId: string;
  expiresAt: number;
  resendAt: number;
  verified?: boolean;
};
export type TicketDetails = {
  reference: string;
  name: string;
  college: string;
  year: string;
  stackTitle: string;
  amount: number;
  confirmedAt: number;
  testMode: boolean;
};

export function formatRupees(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

export function normalizeStudent(input: StudentDetails): StudentDetails {
  const compactPhone = input.phone.replace(/[\s().-]/g, "");
  const phone = /^[6-9]\d{9}$/.test(compactPhone)
    ? `+91${compactPhone}`
    : /^91[6-9]\d{9}$/.test(compactPhone)
      ? `+${compactPhone}`
      : compactPhone;
  return {
    name: input.name.trim().replace(/\s+/g, " "),
    college: input.college.trim().replace(/\s+/g, " "),
    year: input.year,
    email: input.email.trim().toLowerCase(),
    phone,
    gender: input.gender,
    food: input.food,
    stackId: input.stackId,
  };
}

export function validateStudent(input: StudentDetails): FieldErrors {
  const value = normalizeStudent(input);
  const errors: FieldErrors = {};
  if (
    value.name.length < 2 ||
    value.name.length > 100 ||
    /[\u0000-\u001f<>]/.test(value.name)
  )
    errors.name = "Enter your full name (2–100 characters).";
  if (
    value.college.length < 2 ||
    value.college.length > 160 ||
    /[\u0000-\u001f<>]/.test(value.college)
  )
    errors.college = "Enter your college name (2–160 characters).";
  if (!(studyYears as readonly string[]).includes(value.year))
    errors.year = "Choose your year of study.";
  if (
    value.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)
  )
    errors.email = "Enter a valid email address.";
  if (!/^\+[1-9]\d{7,14}$/.test(value.phone))
    errors.phone =
      "Enter a 10-digit Indian mobile number, or include your country code.";
  if (!["male", "female"].includes(value.gender))
    errors.gender = "Choose your gender.";
  if (!["veg", "non-veg"].includes(value.food))
    errors.food = "Choose a food preference.";
  if (!stacks.some((stack) => stack.id === value.stackId))
    errors.stackId = "Choose one learning stack.";
  return errors;
}
