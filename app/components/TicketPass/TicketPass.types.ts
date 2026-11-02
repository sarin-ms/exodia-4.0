import type { TicketDetails } from "@/app/lib/registration";

export type TicketPassProps = Readonly<{
  ticket: TicketDetails;
  exportImage?: boolean;
}>;
