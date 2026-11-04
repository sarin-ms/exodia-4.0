import AboutBackdrop from "@/app/components/AboutBackdrop";
import AboutMotion from "@/app/components/AboutMotion";
import styles from "./About.module.css";

const introduction =
  "EXODIA is a flagship technical learning gala that brings together passionate learners, aspiring innovators and technology enthusiasts from across Kerala. It provides an immersive platform to explore emerging technologies, exchange ideas and discover new possibilities in the ever-evolving world of technology.";

const highlights = [
  "Explore Emerging Technologies",
  "Gain Practical Experience",
  "Connect with Innovators",
  "Develop Technical Skills",
  "Collaborate and Create",
  "Discover New Possibilities",
];

const stats = [
  { count: "180", suffix: "+", label: "Students" },
  { count: "03", label: "Tech Stacks" },
  { count: "02", suffix: " Days", label: "Duration" },
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
            <h2
              className={styles.sectionTitle}
              id="about-heading"
              data-about-reveal
            >
              ABOUT THE EVENT
            </h2>
            <p className={styles.heading}>
              <span className={styles.headingLine}>
                <span data-about-heading>EXODIA 4.0</span>
              </span>
            </p>
            <p className={styles.tagline} data-about-reveal>
              Beyond Learning. Into Innovation.
            </p>
            <p className={styles.lead} data-about-copy>
              {introduction.split(" ").map((word, index) => (
                <span key={`${word}-${index}`}>
                  <span data-about-word>{word}</span>{" "}
                </span>
              ))}
            </p>
            <p className={styles.description} data-about-reveal>
              EXODIA encourages participants to step beyond conventional
              learning through expert-led workshops, hands-on sessions and
              collaborative experiences.
            </p>
            <p className={styles.description} data-about-reveal>
              With three specialised technology tracks, EXODIA 4.0 offers an
              opportunity to experiment with emerging technologies, develop
              practical skills and transform curiosity into creativity.
            </p>
            <p className={styles.description} data-about-reveal>
              More than just a technical event, EXODIA is a celebration of
              innovation, collaboration and continuous learning.
            </p>
            <p className={styles.slogan} data-about-reveal>
              Three Tech Stacks. Two Days. Endless Possibilities.
            </p>
          </div>

          <div className={styles.eventOverview}>
            <div data-about-reveal>
              <h3 className={styles.subheading}>What Awaits You?</h3>
              <ul className={styles.highlights}>
                {highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
            <h3
              className={`${styles.subheading} ${styles.statsHeading}`}
              id="about-stats-heading"
              data-about-reveal
            >
              EXODIA 4.0 at a Glance
            </h3>
            <dl className={styles.stats} aria-labelledby="about-stats-heading">
              {stats.map((stat) => (
                <div className={styles.stat} key={stat.label} data-about-reveal>
                  <dt>{stat.label}</dt>
                  <dd>
                    <span className={styles.accessibleValue}>
                      {stat.count}
                      {stat.suffix}
                    </span>
                    <span aria-hidden="true">
                      <span data-about-count={stat.count}>{stat.count}</span>
                      <span className={styles.statSuffix}>{stat.suffix}</span>
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <AboutMotion />
    </section>
  );
}
