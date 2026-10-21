import Image from "next/image";
import AboutBackdrop from "@/app/components/AboutBackdrop";
import AboutMotion from "@/app/components/AboutMotion";
import styles from "./About.module.css";

const introduction =
  "A meeting ground for curious minds, bold ideas, and the people who love making things.";

const previousEdition = [
  { value: 3, label: "Tech stacks" },
  { value: 180, label: "Participants" },
  { value: 2, label: "Days of innovation" },
];

const organizers = [
  {
    name: "IEDC Bootcamp, College of Engineering Chengannur",
    logo: "/brand/iedc-bootcamp.svg",
    width: 960,
    height: 577,
  },
  { name: "FOCES CEC", logo: "/brand/foces.svg", width: 1657, height: 350 },
  { name: "µLearn CHN", logo: "/brand/mulearn.svg", width: 1445, height: 533 },
];

export default function About() {
  return (
    <section
      className={styles.about}
      id="about"
      aria-labelledby="about-heading"
      tabIndex={-1}
    >
      <AboutBackdrop />
      <div className={styles.inner}>
        <div className={styles.introduction}>
          <div className={styles.copy}>
            <h2 className={styles.sectionTitle} id="about-heading" data-about-reveal>
              What is Exodia
            </h2>
            <p className={styles.heading}>
              <span className={styles.headingLine}>
                <span data-about-heading>Where curiosity</span>
              </span>
              <span className={styles.headingLine}>
                <span data-about-heading>becomes</span>
              </span>
              <span className={`${styles.headingLine} ${styles.headingAccent}`}>
                <span data-about-heading>extraordinary.</span>
              </span>
            </p>
            <p className={styles.gala} data-about-reveal>
              The All Kerala Technical Learning Gala.
            </p>
            <p className={styles.lead} data-about-copy>
              {introduction.split(" ").map((word, index) => (
                <span key={`${word}-${index}`}>
                  <span data-about-word>{word}</span>{" "}
                </span>
              ))}
            </p>
            <p className={styles.description} data-about-reveal>
              Exodia brings learning to life through hands-on experiences and
              shared discovery. Come with a question. Leave with a new skill, a
              fresh perspective, and a story worth telling.
            </p>
          </div>

          <div className={styles.legacy}>
            <p className={styles.legacyEdition} data-about-reveal>
              A look back at <span>Exodia 3.0</span>
            </p>
            <dl className={styles.stats} aria-label="Exodia 3.0 in numbers">
              {previousEdition.map((stat) => (
                <div className={styles.stat} key={stat.label} data-about-reveal>
                  <dt>{stat.label}</dt>
                  <dd>
                    <span className={styles.accessibleValue}>{stat.value}</span>
                    <span aria-hidden="true" data-about-count={stat.value}>
                      {stat.value}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <div className={styles.organizers} data-about-reveal>
              <p className={styles.organizerLabel}>Organised By</p>
              <ul
                className={styles.organizerLogos}
                aria-label="Exodia 3.0 organizers"
              >
                {organizers.map((organizer) => (
                  <li key={organizer.logo}>
                    <Image
                      className={styles.organizerLogo}
                      src={organizer.logo}
                      alt={organizer.name}
                      width={organizer.width}
                      height={organizer.height}
                      unoptimized
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.values} data-about-reveal>
          <p>Learn by doing.</p>
          <span aria-hidden="true">✦</span>
          <p>Build the unexpected.</p>
          <span aria-hidden="true">✦</span>
          <p>Find your people.</p>
        </div>
      </div>
      <AboutMotion />
    </section>
  );
}
