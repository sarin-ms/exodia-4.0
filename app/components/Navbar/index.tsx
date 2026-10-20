import Image from "next/image";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>
      <nav className={styles.navbar} aria-label="Main navigation">
        <a className={styles.brand} href="#home" aria-label="Exodia 4.0 home">
          <Image
            src="/brand/exodia-mark.svg"
            alt=""
            width={42}
            height={42}
            loading="eager"
            unoptimized
          />
        </a>
        <button
          className={styles.register}
          type="button"
          popoverTarget="registration-note"
        >
          Register
          <span className={styles.arrow} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </span>
        </button>
      </nav>
    </header>
  );
}
