import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/rubik";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exodia 4.0",
  description: "All Kerala Technical Learning Gala.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
