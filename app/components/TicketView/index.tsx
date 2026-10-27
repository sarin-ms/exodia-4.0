"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  formatRupees,
  yearLabels,
  type TicketDetails,
} from "@/app/lib/registration";
import styles from "./TicketView.module.css";

export default function TicketView({ apiUrl }: { apiUrl: string }) {
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        let savedToken: string | null = null;
        try {
          savedToken = sessionStorage.getItem("exodia-ticket-token");
        } catch {
          /* Private links also work with storage disabled. */
        }
        const token =
          new URLSearchParams(window.location.hash.slice(1)).get("token") ??
          savedToken;
        if (!token || !/^[a-f0-9]{64}$/.test(token))
          throw new Error(
            "Open the private ticket link from your confirmation email or registration page.",
          );
        try {
          sessionStorage.setItem("exodia-ticket-token", token);
          window.history.replaceState(null, "", window.location.pathname);
        } catch {
          /* Keep the fragment for reloads when browser storage is unavailable. */
        }
        const response = await fetch(apiUrl + "/api/ticket", {
          cache: "no-store",
          headers: { Authorization: "Bearer " + token },
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(
            result.error ?? "This ticket could not be retrieved.",
          );
        setTicket(result);
      } catch (failure) {
        if (!controller.signal.aborted)
          setError(
            failure instanceof Error
              ? failure.message
              : "Your ticket could not be retrieved.",
          );
      }
    };
    void load();
    return () => controller.abort();
  }, [apiUrl]);
  return (
    <main className={styles.page} id="main">
      <Link className={styles.back} href="/">
        ← Back to Exodia
      </Link>
      {error ? (
        <div className={styles.message} role="alert">
          <h1>Your ticket link</h1>
          <p>{error}</p>
          <Link href="/#contact">Contact the Exodia team ↗</Link>
        </div>
      ) : !ticket ? (
        <p className={styles.message} role="status">
          Opening your pass…
        </p>
      ) : (
        <>
          <article className={styles.ticket} aria-label="Your Exodia ticket">
            <header className={styles.header}>
              <Image
                src="/brand/exodia-mark.svg"
                alt=""
                width={48}
                height={48}
                unoptimized
              />
              <div>
                <span className={styles.brand}>exodia</span>
                <small>4.0 / STUDENT PASS</small>
              </div>
              <span className={styles.star} aria-hidden="true">
                ✦
              </span>
            </header>
            <div className={styles.identity}>
              <span>THE NEXT CHAPTER BELONGS TO</span>
              <h1>{ticket.name}</h1>
              <p>
                {ticket.college} · {yearLabels[ticket.year]}
              </p>
            </div>
            <div className={styles.stack}>
              <span>YOUR LEARNING STACK</span>
              <h2>{ticket.stackTitle}</h2>
              <p>One student. One stack. A world of possibilities.</p>
            </div>
            <dl className={styles.details}>
              <div>
                <dt>REGISTRATION</dt>
                <dd>{ticket.reference}</dd>
              </div>
              <div>
                <dt>
                  {ticket.testMode
                    ? "RAZORPAY TEST PAYMENT"
                    : "PAYMENT VERIFIED"}
                </dt>
                <dd>{formatRupees(ticket.amount)}</dd>
              </div>
            </dl>
            <footer className={styles.footer}>
              {ticket.testMode
                ? "Razorpay is in Test Mode. No money was charged."
                : "Keep this pass handy. Schedule and venue updates will be shared by the Exodia team."}
            </footer>
          </article>
          <div className={styles.actions}>
            <button type="button" onClick={() => window.print()}>
              Print / Save ticket ↗
            </button>
            <Link href="/#contact">Need a hand? Contact the team</Link>
            <p>Your private ticket link is in your confirmation email.</p>
          </div>
        </>
      )}
    </main>
  );
}
