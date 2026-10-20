import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <h1 className={styles.title} id="hero-title">
        exodia 4.0
      </h1>
      <p className={styles.subtitle}>All Kerala Technical Learning Gala</p>
    </section>
  );
}
