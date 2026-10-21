import Image from "next/image";
import Particles from "@/app/components/Particles";
import styles from "./Hero.module.css";

const particleColors = [
  "var(--color-text)",
  "var(--color-accent)",
  "var(--color-cameo)",
];

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title" id="home">
      <HeroScenery />
      <div className={styles.frame} aria-hidden="true" />
      <div className={styles.identity}>
        <Image
          className={styles.mark}
          src="/brand/exodia-mark.svg"
          alt=""
          aria-hidden="true"
          width={346}
          height={346}
          loading="eager"
          unoptimized
        />
        <h1 className={styles.title} id="hero-title" aria-label="Exodia 4.0">
          <span className={styles.wordmark}>
            exodia
            <Image
              className={styles.sortingHat}
              src="/images/hero/sorting-hat.png"
              alt=""
              aria-hidden="true"
              width={1254}
              height={1254}
              sizes="(max-width: 767px) 14vw, 120px"
              loading="eager"
            />
          </span>{" "}
          <span>4.0</span>
        </h1>
        <p className={styles.descriptor}>All Kerala Technical Learning Gala</p>
        <HeroSignpost />
      </div>
    </section>
  );
}

function HeroScenery() {
  return (
    <>
      <div className={styles.landscape} aria-hidden="true">
        <Image
          className={styles.sky}
          src="/images/hero/parallax-sky.png"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
        />
        <div className={styles.moon}>
          <Image
            src="/images/hero/parallax-moon.png"
            alt=""
            width={1254}
            height={1254}
            sizes="(max-width: 767px) 180px, 350px"
            loading="eager"
          />
        </div>
        <div className={styles.moonlight} />
        <picture className={styles.castle}>
          <source
            media="(max-width: 767px)"
            srcSet="/images/hero/academy-castle-mobile.webp"
          />
          <Image
            src="/images/hero/academy-castle.webp"
            alt=""
            width={1671}
            height={941}
            loading="eager"
            unoptimized
          />
        </picture>
        <div className={styles.cloudsBack}>
          <Image
            src="/images/hero/parallax-clouds.png"
            alt=""
            fill
            sizes="85vw"
            loading="eager"
          />
        </div>
        <div className={styles.cloudsFront}>
          <Image
            src="/images/hero/parallax-clouds.png"
            alt=""
            fill
            sizes="135vw"
            loading="eager"
          />
        </div>
        <svg
          className={styles.constellations}
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path d="m88 248 114-66 98 58-43 118m860 281 95 52 123-70" />
          <circle cx="88" cy="248" r="1.5" />
          <circle cx="202" cy="182" r="2" />
          <circle cx="300" cy="240" r="1.5" />
          <circle cx="257" cy="358" r="1" />
          <circle cx="1117" cy="639" r="1" />
          <circle cx="1212" cy="691" r="2" />
          <circle cx="1335" cy="621" r="1.5" />
          <path
            className={styles.star}
            d="M202 174v16m-8-8h16m1002 501v16m-8-8h16"
          />
        </svg>
        <div className={styles.vignette} />
      </div>
      <HeroAtmosphere />
    </>
  );
}

function HeroAtmosphere() {
  return (
    <div className={styles.atmosphere} aria-hidden="true">
      <div className={styles.particles} aria-hidden="true">
        <Particles
          particleCount={48}
          particleColors={particleColors}
          particleSpread={12}
          particleBaseSize={44}
          speed={0.025}
          glow={0.25}
          twinkle={0.2}
          drift="up"
          driftSpeed={0.08}
          disableRotation
          moveParticlesOnHover={false}
          clickBurst={false}
          intro={false}
          pixelRatio={1.5}
          opacity={0.4}
        />
      </div>
      <div className={styles.decorations} aria-hidden="true">
        <div className={`${styles.candle} ${styles.candleOne}`}>
          <i />
          <span />
        </div>
        <div className={`${styles.candle} ${styles.candleTwo}`}>
          <i />
          <span />
        </div>
        <FlyingSnitch />
        <div className={styles.mist} />
      </div>
    </div>
  );
}

function FlyingSnitch() {
  return (
    <div className={styles.flightPath} aria-hidden="true">
      <div className={styles.snitch}>
        <div className={`${styles.wing} ${styles.wingLeft}`}>
          <Image
            className={styles.feather}
            src="/images/hero/snitch-wing.png"
            alt=""
            width={1254}
            height={1254}
            sizes="(max-width: 767px) 64px, 128px"
            loading="eager"
          />
        </div>
        <div className={`${styles.wing} ${styles.wingRight}`}>
          <Image
            className={styles.feather}
            src="/images/hero/snitch-wing.png"
            alt=""
            width={1254}
            height={1254}
            sizes="(max-width: 767px) 64px, 128px"
            loading="eager"
          />
        </div>
        <Image
          className={styles.body}
          src="/images/hero/snitch-body.png"
          alt=""
          width={1254}
          height={1254}
          sizes="(max-width: 767px) 32px, 64px"
          loading="eager"
        />
      </div>
    </div>
  );
}

function HeroSignpost() {
  return (
    <div className={styles.signpost}>
      <div className={styles.actions} role="group" aria-label="Explore Exodia">
        <button
          className={`${styles.sign} ${styles.register}`}
          type="button"
          popoverTarget="registration-note"
        >
          <Image
            className={styles.wood}
            src="/images/hero/wooden-signboard.png"
            alt=""
            aria-hidden="true"
            width={2172}
            height={724}
            sizes="(min-width: 768px) 260px, 232px"
          />
          <span className={styles.label}>Register</span>
        </button>
        <a
          className={`${styles.sign} ${styles.about}`}
          href="#about"
        >
          <Image
            className={styles.wood}
            src="/images/hero/wooden-signboard.png"
            alt=""
            aria-hidden="true"
            width={2172}
            height={724}
            sizes="(min-width: 768px) 260px, 232px"
          />
          <span className={styles.label}>Explore</span>
        </a>
      </div>
      <div
        className={styles.notice}
        id="registration-note"
        popover="auto"
        role="dialog"
        aria-labelledby="registration-title"
        aria-describedby="registration-description"
      >
        <span className={styles.noticeStar} aria-hidden="true">
          ✦
        </span>
        <p className={styles.noticeLabel}>Exodia 4.0</p>
        <h2 id="registration-title">Registration coming soon</h2>
        <p className={styles.noticeCopy} id="registration-description">
          Registration isn’t open yet. Check back here for updates on your next
          extraordinary adventure.
        </p>
        <button
          className={styles.dismiss}
          type="button"
          popoverTarget="registration-note"
          popoverTargetAction="hide"
        >
          Back to the magic <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  );
}
