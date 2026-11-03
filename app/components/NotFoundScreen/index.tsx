import Link from "next/link";
import styles from "./NotFoundScreen.module.css";

export default function NotFoundScreen() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Exodia 4.0 home">
          <span className={styles.wordmark}>exodia</span>
          <span className={styles.edition}>4.0</span>
        </Link>
        <p className={styles.label}>The Exodia field guide</p>
      </header>

      <main
        className={styles.main}
        id="main"
        aria-labelledby="not-found-heading"
      >
        <p className={styles.code} aria-label="Error 404">
          404
        </p>
        <p className={styles.eyebrow}>Page not found</p>
        <h1 className={styles.heading} id="not-found-heading">
          This chapter is missing<span>.</span>
        </h1>
        <p className={styles.description}>
          The address may be incorrect, or this page may have moved. Let’s get
          you back to Exodia.
        </p>
        <nav className={styles.actions} aria-label="Find your way">
          <Link className={styles.homeLink} href="/">
            Back to Exodia<span aria-hidden="true">↗</span>
          </Link>
          <Link className={styles.stacksLink} href="/#stacks">
            Explore the stacks<span aria-hidden="true">→</span>
          </Link>
        </nav>
      </main>

      <footer className={styles.footer}>
        <p>All Kerala Technical Learning Gala</p>
        <Link href="/#contact">
          Need a hand? <span aria-hidden="true">↗</span>
        </Link>
      </footer>
    </div>
  );
}
