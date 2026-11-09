import { scheduleDays } from "@/app/content/schedule";
import styles from "./Schedule.module.css";

export default function Schedule() {
  return (
    <section
      className={styles.schedule}
      id="schedule"
      aria-labelledby="schedule-heading"
      tabIndex={-1}
    >
      <div className={styles.paper}>
        <header>
          <MastheadRule />
          <p className={styles.edition}>
            <span>Exodia 4.0</span>
            <span>Special edition</span>
          </p>
          <MastheadTitle />
          <MastheadRule />
        </header>

        <div className={styles.frontPage}>
          <div>
            <p className={styles.kicker}>Event programme</p>
            <h2 className={styles.heading} id="schedule-heading">
              Schedule
            </h2>
          </div>
          <p className={styles.tagline}>
            Two days. Three tech stacks. One unforgettable experience.
          </p>
        </div>

        <div className={styles.days}>
          {scheduleDays.map(({ number, dateTime, dateLabel, sessions }) => (
            <div className={styles.day} key={number}>
              <h3 className={styles.dayHeading}>
                <span>
                  Day <span className={styles.dayNumber}>{number}</span>
                </span>
                <time className={styles.date} dateTime={dateTime}>
                  {dateLabel}
                </time>
              </h3>
              <ul className={styles.sessions}>
                {sessions.map((session) => (
                  <li key={session}>{session}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className={styles.notice}>
          <span aria-hidden="true">◆</span>
          Detailed session timings and venue allocations will be announced soon.
        </p>
      </div>
    </section>
  );
}

function MastheadRule() {
  return (
    <svg
      className={styles.mastheadRule}
      viewBox="0 0 710 16"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M29 5h652M29 11h652"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 8 11 2l12 6-12 6Zm22 0 16-5 13 5-13 5Zm42 0 12-4 12 4-12 4Zm99 0 12-4 12 4-12 4Zm174 0 18-8 18 8-18 8Zm186 0 12-4 12 4-12 4Zm99 0 12-4 12 4-12 4Zm37 0 13-5 16 5-16 5Zm28 0 12-6 11 6-11 6Z"
        fill="currentColor"
      />
      <path
        d="M8 8h6m337 0h8m337 0h6"
        stroke="var(--newsprint)"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function MastheadTitle() {
  return (
    <svg
      className={styles.name}
      viewBox="0 0 710 92"
      role="img"
      aria-label="The Exodia Prophet"
    >
      <defs>
        <filter id="schedule-press-ink">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="3"
            seed="7"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.5 0 0 0 -0.32"
            result="inkCoverage"
          />
          <feComposite in="SourceGraphic" in2="inkCoverage" operator="in" />
        </filter>
        <path
          id="schedule-glyph-e"
          d="M1 8h43l-5 18-2-12H17v29h13l5-8v22l-5-9H17v30h18l9-13-3 19H1l7-7V16Z"
        />
        <path
          id="schedule-glyph-o"
          d="M27 6C10 6 1 25 1 46s9 40 26 40 26-19 26-40S44 6 27 6Zm0 5c10 0 15 15 15 35s-5 35-15 35-15-15-15-35 5-35 15-35Zm0 28 6 7-6 7-6-7Z"
        />
        <path
          id="schedule-glyph-p"
          d="M1 8h23c16 0 24 8 24 21S38 50 19 50h-2v27l8 7H1l7-7V15Zm16 5v32h4c10 0 17-6 17-16s-6-16-17-16Zm9 11 4 5-4 5-4-5Z"
        />
      </defs>
      <g
        fill="currentColor"
        filter="url(#schedule-press-ink)"
        fillRule="evenodd"
      >
        <use href="#schedule-glyph-e" x="2" />
        <path d="M49 8h24l-5 6 12 23 13-23-6-6h16l-7 8-14 27 18 34 7 7H83l5-7-13-25-15 25 7 7H49l7-8 16-31-16-29Z" />
        <use href="#schedule-glyph-o" x="108" />
        <path d="M167 8h20c24 0 34 17 34 37 0 21-13 39-36 39h-18l7-8V16Zm17 5v65h2c15 0 24-14 24-33 0-17-7-32-24-32Zm10 27 5 6-5 6-5-6Z" />
        <path d="M223 8h23l-7 8v61l7 7h-23l7-7V16Z" />
        <path d="M272 6h4l20 71 7 7h-23l6-7-6-22h-16l-7 22 6 7h-18l8-8Zm0 20-7 24h14Zm-3 36 5-5 5 5-5 5Z" />
        <text
          x="318"
          y="53"
          fontFamily="Georgia, serif"
          fontSize="14"
          textAnchor="middle"
        >
          THE
        </text>
        <use href="#schedule-glyph-p" x="338" />
        <path d="M389 8h25c15 0 23 8 23 21 0 10-5 16-15 19l15 28 8 8h-15l-18-34h-6v27l7 7h-24l7-7V15Zm17 5v32h5c10 0 16-6 16-16s-6-16-16-16Zm9 11 4 5-4 5-4-5Z" />
        <use href="#schedule-glyph-o" x="445" />
        <use href="#schedule-glyph-p" x="504" />
        <path d="M556 8h23l-7 8v26h21V16l-7-8h23l-7 8v61l7 7h-23l7-7V47h-21v30l7 7h-23l7-7V16Zm26 52 4 5-4 5-4-5Z" />
        <use href="#schedule-glyph-e" x="614" />
        <path d="M663 8h45l-2 19-4-13h-12v63l7 7h-24l7-7V14h-11l-7 13Z" />
      </g>
    </svg>
  );
}
