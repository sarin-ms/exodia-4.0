import type { TicketDetails } from "@/app/lib/registration";

export type RecoveredTicket = { ticket: TicketDetails; token: string };
export type TicketLookupResult = { tickets: RecoveredTicket[] };

export function normalizeTicketEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isTicketEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
