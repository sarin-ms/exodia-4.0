"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import CodeSlots from "@/app/components/CodeSlots";
import { formatRupees } from "@/app/lib/registration";
import type { RecoveredTicket } from "@/app/lib/ticket-lookup";
import useTicketLookup from "./useTicketLookup";
import styles from "./TicketLookup.module.css";

export default function TicketLookup({
  apiUrl,
  onOpen,
  notice,
}: {
  apiUrl: string;
  onOpen: (ticket: RecoveredTicket) => void;
  notice?: string;
}) {
  const form = useTicketLookup(apiUrl, onOpen);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (form.tickets !== null) resultsHeading.current?.focus();
  }, [form.tickets]);
  return (
    <section className={styles.lookup} aria-labelledby="ticket-lookup-title">
      <div className={styles.art} aria-hidden="true">
        <Image
          src="/images/hero/sorting-hat.png"
          alt=""
          width={1254}
          height={1254}
          sizes="100px"
        />
      </div>
      <p className={styles.eyebrow}>EXODIA 4.0 / YOUR STUDENT PASS</p>
      <h1 id="ticket-lookup-title">Find your ticket.</h1>
      <p className={styles.description}>
        Your next chapter is waiting. Use your registration email to find your
        pass.
      </p>

      <div className={styles.card}>
        {form.tickets !== null ? (
          <div className={styles.results}>
            <span className={styles.verified}>✓ EMAIL VERIFIED</span>
            <h2 ref={resultsHeading} tabIndex={-1}>
              {form.tickets.length
                ? "Your tickets are ready."
                : "No confirmed ticket yet."}
            </h2>
            <p>
              {form.tickets.length
                ? "Choose a pass to open and download."
                : "We couldn’t find a confirmed ticket for this email. Check that you used the email from your registration."}
            </p>
            {form.tickets.map((entry) => (
              <button
                className={styles.ticketChoice}
                type="button"
                key={entry.ticket.reference}
                onClick={() => onOpen(entry)}
              >
                <span>
                  <strong>{entry.ticket.stackTitle}</strong>
                  <small>{entry.ticket.reference}</small>
                </span>
                <span>
                  {formatRupees(entry.ticket.amount)}{" "}
                  <span aria-hidden="true">↗</span>
                </span>
              </button>
            ))}
            <button
              className={styles.textButton}
              type="button"
              onClick={form.changeEmail}
            >
              Use another email
            </button>
          </div>
        ) : form.verification ? (
          <form
            className={styles.form}
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void form.verifyCode();
            }}
          >
            <h2>Check your inbox.</h2>
            <p className={styles.copy}>
              Enter the six-digit code sent to <strong>{form.email}</strong>.
            </p>
            <div className={styles.codeRow}>
              <CodeSlots
                value={form.code}
                onChange={(code) => {
                  form.setCode(code);
                  if (code) form.setError("");
                }}
                status={form.error ? "error" : "idle"}
                disabled={form.busy}
                autoFocus
                slotSize={42}
                gap={8}
                radius={9}
                ariaLabel="Ticket lookup verification code"
                describedBy="ticket-code-hint ticket-lookup-error"
              />
            </div>
            <small className={styles.hint} id="ticket-code-hint">
              The code expires in 10 minutes. Check your spam folder too.
            </small>
            {form.error && (
              <p className={styles.error} id="ticket-lookup-error" role="alert">
                {form.error}
              </p>
            )}
            <button
              className={styles.primary}
              type="submit"
              disabled={form.busy || form.code.length !== 6}
            >
              {form.busy ? "Finding your ticket…" : "Verify & find my ticket"}
              <span aria-hidden="true">→</span>
            </button>
            <div className={styles.inlineActions}>
              <button
                className={styles.textButton}
                type="button"
                disabled={form.busy || form.resendSeconds > 0}
                onClick={() => {
                  void form.sendCode();
                }}
              >
                {form.resendSeconds > 0
                  ? `Resend in ${form.resendSeconds}s`
                  : "Resend code"}
              </button>
              <button
                className={styles.textButton}
                type="button"
                disabled={form.busy}
                onClick={form.changeEmail}
              >
                Change email
              </button>
            </div>
          </form>
        ) : (
          <form
            className={styles.form}
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void form.sendCode();
            }}
          >
            <h2>Your ticket, a code away.</h2>
            <p className={styles.copy}>
              We’ll email you a code to verify it’s you, then show your
              confirmed tickets.
            </p>
            {notice && (
              <p className={styles.hint} role="status">
                {notice}
              </p>
            )}
            <label className={styles.field} htmlFor="ticket-email">
              <span>Registration email</span>
              <input
                id="ticket-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={form.email}
                required
                maxLength={254}
                disabled={form.busy}
                aria-invalid={!!form.error}
                aria-describedby={
                  form.error ? "ticket-lookup-error" : "ticket-email-hint"
                }
                onChange={(event) => {
                  form.setEmail(event.target.value);
                  form.setError("");
                }}
              />
            </label>
            <small className={styles.hint} id="ticket-email-hint">
              Use the same address you registered with.
            </small>
            {form.error && (
              <p className={styles.error} id="ticket-lookup-error" role="alert">
                {form.error}
              </p>
            )}
            <button
              className={styles.primary}
              type="submit"
              disabled={form.busy}
            >
              {form.busy ? "Sending your code…" : "Send verification code"}
              <span aria-hidden="true">→</span>
            </button>
          </form>
        )}
      </div>
      <div className={styles.footer}>
        <Link href="/#contact">Need a hand? Contact the team ↗</Link>
        <Link href="/register">Register for Exodia ↗</Link>
      </div>
    </section>
  );
}
