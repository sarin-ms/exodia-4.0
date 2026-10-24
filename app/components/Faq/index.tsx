import FaqAccordion from "@/app/components/FaqAccordion";
import { faq } from "@/app/content/faq";
import styles from "./Faq.module.css";

export default function Faq() {
  return (
    <section
      className={styles.faq}
      id="faq"
      aria-labelledby="faq-heading"
      tabIndex={-1}
    >
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.introduction}>
          <p className={styles.eyebrow} data-faq-reveal>
            <span aria-hidden="true" />A little clarity
          </p>
          <h2 className={styles.heading} id="faq-heading">
            <span className={styles.headingLine}>
              <span data-faq-heading>Frequently</span>
            </span>{" "}
            <span className={styles.headingLine}>
              <span data-faq-heading>asked</span>
            </span>{" "}
            <span className={`${styles.headingLine} ${styles.headingAccent}`}>
              <span data-faq-heading>questions.</span>
            </span>
          </h2>
          <p className={styles.description} data-faq-reveal>
            A few answers before your
            <br />
            next extraordinary adventure.
          </p>

          <span className={styles.questionMark} aria-hidden="true">
            ?
          </span>
        </header>
        <FaqAccordion items={faq} />
      </div>
    </section>
  );
}
