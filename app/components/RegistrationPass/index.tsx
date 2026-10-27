import Image from "next/image";
import { formatRupees } from "@/app/lib/registration";
import styles from "./RegistrationPass.module.css";

export default function RegistrationPass({
  amount,
  stackTitle,
}: {
  amount: number;
  stackTitle?: string;
}) {
  return (
    <div className={styles.pass} aria-label="Exodia student pass preview">
      <div className={styles.top}>
        <span>EXODIA 4.0</span>
        <span>STUDENT EDITION</span>
      </div>
      <div className={styles.art}>
        <div className={styles.orbit} aria-hidden="true" />
        <div className={styles.orbitInner} aria-hidden="true" />
        <span className={styles.spark} aria-hidden="true">
          ✧
        </span>
        <Image
          className={styles.mark}
          src="/brand/exodia-mark.svg"
          alt=""
          width={96}
          height={96}
          unoptimized
        />
        <p>
          A pass to
          <br />
          what’s next.
        </p>
        <span className={styles.vertical} aria-hidden="true">
          LEARN. BUILD. BELONG.
        </span>
      </div>
      <div className={styles.stub}>
        <div>
          <span>YOUR LEARNING STACK</span>
          <strong>{stackTitle ?? "Choose your next adventure"}</strong>
          <small>One student · One stack</small>
        </div>
        <div className={styles.price}>
          <span>ENTRY PASS</span>
          <strong>{formatRupees(amount)}</strong>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>ALL KERALA TECHNICAL LEARNING GALA</span>
        <span aria-hidden="true">↗</span>
      </div>
    </div>
  );
}
