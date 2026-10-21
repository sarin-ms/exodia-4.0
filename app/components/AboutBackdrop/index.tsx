import styles from "./AboutBackdrop.module.css";

const stars = Array.from({ length: 38 }, (_, index) => ({
  left: `${(index * 37 + 7) % 100}%`,
  top: `${(index * 29 + 11) % 100}%`,
  opacity: 0.2 + (index % 4) * 0.1,
  width: index % 5 === 0 ? "2px" : "1px",
  height: index % 5 === 0 ? "2px" : "1px",
}));

export default function AboutBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.haze} />
      <div className={styles.source} />
      <div className={styles.rays} data-about-rays />
      <svg
        className={styles.veil}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        focusable="false"
        data-about-veil
      >
        <defs>
          <linearGradient
            id="about-mist-color"
            x1="1300"
            y1="0"
            x2="720"
            y2="900"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--color-cameo)" stopOpacity="0.3" />
            <stop
              offset="0.38"
              stopColor="var(--color-accent)"
              stopOpacity="0.75"
            />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
          <filter
            id="about-mist-soften"
            x="-50%"
            y="-30%"
            width="200%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <filter
            id="about-mist-fine"
            x="-50%"
            y="-30%"
            width="200%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <g stroke="url(#about-mist-color)" filter="url(#about-mist-soften)">
          <path
            d="M1430-160C1120 90 1490 230 1160 430S1060 760 1370 1040"
            strokeWidth="100"
          />
          <path
            d="M1190-180C890 100 1240 300 930 500S720 780 1080 1040"
            strokeWidth="55"
            opacity="0.6"
          />
          <path
            d="M1730 210C1410 340 1580 510 1280 650S1130 900 1460 1080"
            strokeWidth="90"
            opacity="0.55"
          />
        </g>
        <g
          stroke="url(#about-mist-color)"
          filter="url(#about-mist-fine)"
          opacity="0.4"
        >
          <path
            d="M1450-140C1090 130 1480 270 1140 450S1080 780 1380 1040"
            strokeWidth="4"
          />
          <path
            d="M1220-140C930 160 1200 280 940 520S780 780 1060 1040"
            strokeWidth="3"
          />
        </g>
      </svg>
      <div className={styles.stars}>
        {stars.map((style, index) => (
          <span key={index} style={style} />
        ))}
      </div>
      <div className={styles.vignette} />
    </div>
  );
}
