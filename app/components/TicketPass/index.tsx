import Image from "next/image";
import type { CSSProperties } from "react";
import qrcode from "qrcode-generator";
import { formatRupees, yearLabels } from "@/app/lib/registration";
import type { TicketPassProps } from "./TicketPass.types";
import styles from "./TicketPass.module.css";

export default function TicketPass({ ticket, exportImage = false }: TicketPassProps) {
  const code = qrcode(0, "M");
  // Staff validate this reference against D1. The private ticket token stays private.
  code.addData(ticket.reference, "Alphanumeric");
  code.make();
  const modules = code.getModuleCount();
  const cells: string[] = [];
  const nameStyle = {
    "--name-size": ticket.name.length > 45 ? "2.2cqi" : ticket.name.length > 26 ? "2.75cqi" : "3.5cqi",
  } as CSSProperties;
  for (let row = 0; row < modules; row++) {
    for (let column = 0; column < modules; column++) {
      if (code.isDark(row, column))
        cells.push(`M${column + 4},${row + 4}h1v1h-1z`);
    }
  }

  return (
    <div className={styles.frame}>
      <article className={styles.ticket} aria-label={`Exodia student pass for ${ticket.name}`}>
        <div className={styles.main}>
          <div className={styles.scenery} aria-hidden="true">
            <div className={styles.moon}>
              <Image src="/images/hero/parallax-moon.png" alt="" fill sizes={exportImage ? "640px" : "(max-width: 600px) 90px, 280px"} loading={exportImage ? "lazy" : "eager"} />
            </div>
          </div>
          <header className={styles.header}>
            <div className={styles.wordmark}>
              <Image src="/brand/exodia-title.svg" alt="Exodia 4.0" width={5312} height={679} unoptimized loading="eager" />
            </div>
            <p className={styles.eventType}>All Kerala Technical Learning Gala</p>
          </header>
          <div className={styles.identity}>
            <span className={styles.eyebrow}>Participant pass</span>
            <h2 style={nameStyle}>{ticket.name}</h2>
            <p>{ticket.college}<span className={styles.year}>{yearLabels[ticket.year]}</span></p>
          </div>
          <footer className={styles.footer}>
            <div className={styles.details}>
              <div className={styles.stack}><span className={styles.eyebrow}>Your learning stack</span><strong>{ticket.stackTitle}</strong></div>
              <div className={styles.payment}><span className={styles.eyebrow}>Payment verified</span><strong>{formatRupees(ticket.amount)}</strong></div>
            </div>
            <p className={styles.motto}>The castle awaits. Magic awakens.</p>
          </footer>
        </div>
        <aside className={styles.stub} aria-label="Admission details">
          <span className={styles.admit}>Admit one</span>
          <div className={styles.scan}>
            <svg className={styles.qr} viewBox={`0 0 ${modules + 8} ${modules + 8}`} role="img" aria-label={`Admission QR code: ${ticket.reference}`} shapeRendering="crispEdges">
              <rect width="100%" height="100%" fill="var(--color-paper-light)" />
              <path d={cells.join("")} fill="currentColor" />
            </svg>
            <span>Scan at entry</span>
          </div>
          <div className={styles.reference}>
            <span>Registration</span>
            <strong>{ticket.reference.slice(0, 4)}<wbr />{ticket.reference.slice(4, 12)}<wbr />{ticket.reference.slice(12)}</strong>
          </div>
          <div className={styles.stubEnd} aria-hidden="true"><span />✦<span /></div>
        </aside>
      </article>
    </div>
  );
}
