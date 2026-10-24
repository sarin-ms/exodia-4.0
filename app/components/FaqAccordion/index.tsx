"use client";

import { useRef } from "react";
import type { FaqAccordionProps } from "./FaqAccordion.types";
import useFaqAccordion from "./useFaqAccordion";
import styles from "./FaqAccordion.module.css";

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useFaqAccordion(rootRef);

  return (
    <div className={styles.accordion} ref={rootRef} data-faq-list>
      <div className={styles.spotlight} data-faq-spotlight aria-hidden="true" />
      {items.map((item, index) => (
        <details
          className={styles.item}
          key={item.id}
          data-faq-item
          data-faq-open={index === 0 ? "true" : "false"}
          open={index === 0}
        >
          <summary
            className={styles.question}
            aria-controls={`faq-answer-${item.id}`}
          >
            <span className={styles.number} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={styles.questionText}
              id={`faq-question-${item.id}`}
            >
              {item.question}
            </span>
            <span className={styles.icon} aria-hidden="true">
              <span />
              <span data-faq-icon />
            </span>
          </summary>
          <div
            className={styles.answer}
            data-faq-answer
            id={`faq-answer-${item.id}`}
            role="region"
            aria-labelledby={`faq-question-${item.id}`}
          >
            <div className={styles.answerInner} data-faq-copy>
              <p>{item.answer}</p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
