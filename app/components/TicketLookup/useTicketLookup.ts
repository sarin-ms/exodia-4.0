"use client";

import { useEffect, useRef, useState } from "react";
import type { EmailVerification } from "@/app/lib/registration";
import { isTicketEmail, normalizeTicketEmail, type RecoveredTicket, type TicketLookupResult } from "@/app/lib/ticket-lookup";

export default function useTicketLookup(apiUrl: string, onOpen: (ticket: RecoveredTicket) => void) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [verification, setVerification] = useState<EmailVerification | null>(null);
  const [tickets, setTickets] = useState<RecoveredTicket[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [clock, setClock] = useState(() => Date.now() / 1000);
  const accessToken = useRef("");
  const inFlight = useRef(false);

  useEffect(() => {
    if (!verification) return;
    const timer = setInterval(() => setClock(Date.now() / 1000), 1000);
    return () => clearInterval(timer);
  }, [verification]);

  async function request<T>(path: string, body: unknown): Promise<T> {
    if (!accessToken.current) accessToken.current = Array.from(crypto.getRandomValues(new Uint8Array(32)), (n) => n.toString(16).padStart(2, "0")).join("");
    const response = await fetch(apiUrl + path, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + accessToken.current },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(25000),
    }).catch(() => {
      throw new Error("Couldn’t reach ticket lookup. Check your connection and try again.");
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result) throw new Error(result?.error ?? "Ticket lookup couldn’t connect. Please try again shortly.");
    return result as T;
  }

  async function sendCode() {
    if (inFlight.current) return;
    const normalized = normalizeTicketEmail(email);
    if (!isTicketEmail(normalized)) {
      setError("Enter the email address used for registration.");
      return;
    }
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const challenge = await request<EmailVerification>("/api/ticket-lookup/request", { email: normalized });
      setEmail(normalized);
      setCode("");
      setTickets(null);
      setClock(Date.now() / 1000);
      setVerification(challenge);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Your code could not be sent. Please try again.");
    } finally {
      setBusy(false);
      inFlight.current = false;
    }
  }

  async function verifyCode() {
    if (inFlight.current || !verification) return;
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the six-digit code from your email.");
      return;
    }
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await request<TicketLookupResult>("/api/ticket-lookup/verify", { verificationId: verification.verificationId, code });
      setTickets(result.tickets);
      if (result.tickets.length === 1) onOpen(result.tickets[0]);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Your code could not be verified. Please try again.");
    } finally {
      setBusy(false);
      inFlight.current = false;
    }
  }

  function changeEmail() {
    setVerification(null);
    setTickets(null);
    setCode("");
    setError("");
  }

  return { email, setEmail, code, setCode, verification, tickets, error, setError, busy,
    resendSeconds: verification ? Math.max(0, Math.ceil(verification.resendAt - clock)) : 0,
    sendCode, verifyCode, changeEmail };
}
