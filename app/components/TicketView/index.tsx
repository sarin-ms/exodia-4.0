"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TicketPass from "@/app/components/TicketPass";
import TicketLookup from "@/app/components/TicketLookup";
import type { TicketDetails } from "@/app/lib/registration";
import type { RecoveredTicket } from "@/app/lib/ticket-lookup";
import styles from "./TicketView.module.css";

export default function TicketView({ apiUrl }: { apiUrl: string }) {
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [error, setError] = useState("");
  const [lookupVisible, setLookupVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState("");
  const exportStage = useRef<HTMLDivElement>(null);
  const downloadInFlight = useRef(false);
  const fullSizeDialog = useRef<HTMLDialogElement>(null);
  const ticketHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (ticket) ticketHeading.current?.focus();
  }, [ticket]);

  function openRecoveredTicket(entry: RecoveredTicket) {
    if (!/^[a-f0-9]{64}$/.test(entry.token)) return;
    try {
      sessionStorage.setItem("exodia-ticket-token", entry.token);
      window.history.replaceState(null, "", window.location.pathname);
    } catch { /* The verified pass remains usable without browser storage. */ }
    setError("");
    setLookupVisible(false);
    setTicket(entry.ticket);
  }

  function findAnotherTicket() {
    try { sessionStorage.removeItem("exodia-ticket-token"); } catch { /* Storage is optional. */ }
    setTicket(null);
    setError("");
    setDownloadNotice("");
    setLookupVisible(true);
  }

  async function downloadTicket() {
    const node = exportStage.current?.firstElementChild;
    if (!ticket || !(node instanceof HTMLElement) || downloadInFlight.current)
      return;
    downloadInFlight.current = true;
    setDownloading(true);
    setDownloadNotice("");
    try {
      const { createTicketPng } = await import("@/app/lib/ticket-image");
      const blob = await createTicketPng(node);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `exodia-ticket-${ticket.reference.replace(/[^a-z0-9-]/gi, "").toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
      setDownloadNotice("Your PNG download has started.");
    } catch {
      setDownloadNotice(
        "We couldn’t create your ticket image. Please try downloading again.",
      );
    } finally {
      downloadInFlight.current = false;
      setDownloading(false);
    }
  }

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
        if (!token) {
          setLookupVisible(true);
          return;
        }
        if (!/^[a-f0-9]{64}$/.test(token)) throw new Error("This ticket link is incomplete. Find your pass using your registration email.");
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
        if (!controller.signal.aborted) {
          setLookupVisible(true);
          setError(
            failure instanceof Error
              ? failure.message
              : "Your ticket could not be retrieved.",
          );
        }
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
      {!ticket && lookupVisible ? (
        <TicketLookup apiUrl={apiUrl} onOpen={openRecoveredTicket} notice={error} />
      ) : !ticket ? (
        <p className={styles.message} role="status">
          Opening your pass…
        </p>
      ) : (
        <>
          <header className={styles.intro}>
            <span>Registration confirmed</span>
            <h1 ref={ticketHeading} tabIndex={-1}>Your next chapter, booked.</h1>
          </header>
          <TicketPass ticket={ticket} />
          <div className={styles.actions}>
            <div className={styles.actionButtons}>
              <button
                type="button"
                onClick={() => { void downloadTicket(); }}
                disabled={downloading}
                aria-busy={downloading}
              >
                {downloading ? "Preparing PNG…" : "Download ticket"}{" "}
                <span aria-hidden="true">↓</span>
              </button>
              <button
                className={styles.enlargeButton}
                type="button"
                onClick={() => fullSizeDialog.current?.showModal()}
              >
                View full size <span aria-hidden="true">↗</span>
              </button>
            </div>
            <Link href="/#contact">Need a hand? Contact the team</Link>
          </div>
          {downloadNotice && (
            <p className={styles.downloadNotice} role="status">{downloadNotice}</p>
          )}
          <div className={styles.exportStage} ref={exportStage} aria-hidden="true">
            <TicketPass ticket={ticket} exportImage />
          </div>
          <dialog ref={fullSizeDialog} className={styles.zoomDialog} aria-labelledby="full-ticket-title">
            <div className={styles.zoomHeader}>
              <h2 id="full-ticket-title">Your student pass</h2>
              <button type="button" onClick={() => fullSizeDialog.current?.close()}>Close <span aria-hidden="true">✕</span></button>
            </div>
            <div className={styles.zoomCanvas} role="region" tabIndex={0} aria-label="Full size ticket. Scroll horizontally to see the whole pass.">
              <div className={styles.zoomPass}><TicketPass ticket={ticket} /></div>
            </div>
            <p>Swipe or scroll across to see your whole pass.</p>
          </dialog>
          <p className={styles.help}>
            Bring this pass to entry. Your private ticket link is in your
            confirmation email. Schedule and venue details will be shared by
            the Exodia team.
          </p>
          <button type="button" className={styles.lookupAgain} onClick={findAnotherTicket}>Find another ticket</button>
        </>
      )}
    </main>
  );
}
