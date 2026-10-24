import GlimpsesGallery from "@/app/components/GlimpsesGallery";
import { glimpses } from "@/app/content/glimpses";
import styles from "./Glimpses.module.css";

export default function Glimpses() {
  return (
    <section
      className={styles.glimpses}
      id="glimpses"
      aria-labelledby="glimpses-heading"
      tabIndex={-1}
    >
      <div className={styles.atmosphere} aria-hidden="true" />
      <header className={styles.header} data-glimpses-reveal>
        <p className={styles.eyebrow}>
          <span aria-hidden="true" />
          The Exodia archives
          <span aria-hidden="true" />
        </p>
        <h2 className={styles.heading} id="glimpses-heading">
          Glimpses<span>.</span>
        </h2>
        <p className={styles.subtitle}>Moments from previous editions.</p>
      </header>
      <GlimpsesGallery photos={glimpses} />
    </section>
  );
}
