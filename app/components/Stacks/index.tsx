import Image from "next/image";
import StacksMotion from "@/app/components/StacksMotion";
import { stacks } from "@/app/content/stacks";
import styles from "./Stacks.module.css";

export default function Stacks() {
  return (
    <section
      className={styles.stacks}
      id="stacks"
      aria-labelledby="stacks-heading"
      tabIndex={-1}
    >
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.stage} data-book-stage>
        <div className={styles.inner}>
          <header className={styles.header} data-book-reveal>
            <div>
              <p className={styles.eyebrow}>The learning collection</p>
              <h2 className={styles.heading} id="stacks-heading">
                The stacks<span>.</span>
              </h2>
            </div>
            <p className={styles.intro}>
              Three disciplines.
              <br />
              One shared curiosity.
            </p>
          </header>

          <div
            className={styles.bookShell}
            data-spellbook
            data-book-reveal
            tabIndex={0}
            role="region"
            aria-label="Stack field guide"
          >
            <div className={styles.cover} aria-hidden="true" />
            <div className={styles.pageEdges} aria-hidden="true" />
            <div className={styles.bookLayer}>
              <div className={styles.book} data-book>
                {stacks.map((stack, index) => (
                  <article
                    className={styles.spread}
                    data-book-spread
                    data-stack={stack.id}
                    key={stack.id}
                    id={`stack-page-${stack.id}`}
                    aria-labelledby={`stack-title-${stack.id}`}
                  >
                    <div
                      className={`${styles.page} ${styles.leftPage}`}
                      data-book-left
                    >
                      <p className={styles.runningHead}>
                        <span>Exodia / Field notes</span>
                        <span>Vol. IV</span>
                      </p>
                      <p className={styles.chapterKicker}>
                        Chapter {stack.number}
                      </p>
                      <h3
                        className={styles.stackTitle}
                        id={`stack-title-${stack.id}`}
                      >
                        {stack.title}
                      </h3>
                      <span className={styles.ornament} aria-hidden="true">
                        ◆
                      </span>
                      <p className={styles.description}>{stack.description}</p>
                      <div className={styles.topicsBlock}>
                        <p className={styles.topicsLabel}>Inside this chapter</p>
                        <ul
                          className={styles.topics}
                          aria-label={`${stack.title} areas to explore`}
                        >
                          {stack.topics.map((topic) => (
                            <li key={topic}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                      <p className={styles.motif}>{stack.motif}</p>
                      <div className={styles.folio}>
                        <span>The learning collection</span>
                        <span>{String(index * 2 + 1).padStart(2, "0")}</span>
                      </div>
                    </div>
                    <div
                      className={`${styles.page} ${styles.rightPage}`}
                      data-book-right
                    >
                      <p className={styles.plateHeading}>
                        <span>Exodia 4.0</span>
                        <span>Plate {stack.number}</span>
                      </p>
                      <div className={styles.artImage}>
                        <Image
                          className={styles.illustration}
                          src={stack.image}
                          alt=""
                          fill
                          sizes="(min-width: 900px) 430px, 75vw"
                          loading={index === 0 ? "eager" : "lazy"}
                          unoptimized
                        />
                      </div>
                      <p className={styles.plateCaption}>{stack.category}</p>
                      <div className={`${styles.folio} ${styles.rightFolio}`}>
                        <span>{stack.title}</span>
                        <span>{String(index * 2 + 2).padStart(2, "0")}</span>
                      </div>
                    </div>
                  </article>
                ))}
                <div
                  className={styles.castShadow}
                  data-book-shadow
                  aria-hidden="true"
                />
                <div
                  className={styles.curlShadow}
                  data-book-curl-shadow
                  aria-hidden="true"
                >
                  <span
                    className={styles.curlShadowBand}
                    data-book-curl-shadow-band
                  />
                </div>
                {stacks.slice(0, -1).map((stack) => (
                  <div
                    className={styles.turningPage}
                    data-book-leaf
                    hidden
                    aria-hidden="true"
                    key={stack.id}
                  >
                    {Array.from({ length: 10 }, (_, index) => (
                      <div
                        className={styles.pageSlice}
                        data-book-slice
                        key={index}
                      >
                        <div
                          className={`${styles.sliceFace} ${styles.sliceFront}`}
                          data-slice-front
                        >
                          <div
                            className={styles.sliceContent}
                            data-slice-content
                          />
                          <span
                            className={`${styles.sliceShade} ${styles.shadeStart}`}
                            data-slice-front-shade
                          />
                          <span
                            className={`${styles.sliceShade} ${styles.shadeEnd}`}
                            data-slice-front-shade
                          />
                        </div>
                        <div
                          className={`${styles.sliceFace} ${styles.sliceBack}`}
                          data-slice-back
                        >
                          <div
                            className={styles.sliceContent}
                            data-slice-content
                          />
                          <span
                            className={`${styles.sliceShade} ${styles.shadeStart}`}
                            data-slice-back-shade
                          />
                          <span
                            className={`${styles.sliceShade} ${styles.shadeEnd}`}
                            data-slice-back-shade
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.spine} aria-hidden="true" />
            <div className={styles.ribbon} data-book-ribbon aria-hidden="true">
              <svg
                className={styles.ribbonShape}
                viewBox="-48 -48 112 128"
                focusable="false"
              >
                <defs>
                  <linearGradient id="stack-ribbon-color" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-plum)" />
                    <stop offset="38%" stopColor="var(--color-accent)" />
                    <stop offset="100%" stopColor="var(--color-plum)" />
                  </linearGradient>
                  <pattern id="stack-ribbon-weave" width="4" height="3" patternUnits="userSpaceOnUse">
                    <path d="M0 2.5H4" stroke="var(--color-cameo)" strokeOpacity="0.13" strokeWidth="0.6" />
                  </pattern>
                </defs>
                <path
                  data-book-ribbon-body
                  d="M-7 0C-7 9-7 32-6 44L1 39L8 44C9 32 7 9 7 0Z"
                  fill="url(#stack-ribbon-color)"
                />
                <path
                  data-book-ribbon-weave
                  d="M-7 0C-7 9-7 32-6 44L1 39L8 44C9 32 7 9 7 0Z"
                  fill="url(#stack-ribbon-weave)"
                />
                <path
                  className={styles.ribbonEdge}
                  data-book-ribbon-edge
                  d="M7 0C7 9 9 32 8 44"
                />
                <path className={styles.ribbonStitch} d="M-5 1H5" />
              </svg>
            </div>
          </div>

          <nav
            className={styles.chapters}
            aria-label="Stack chapters"
            data-book-chapters
            data-book-reveal
          >
            {stacks.map((stack) => (
              <a
                className={styles.chapterLabel}
                href={`#stack-page-${stack.id}`}
                data-book-choice
                key={stack.id}
              >
                <span className={styles.chapterNumber}>{stack.number}</span>
                <span>{stack.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
      <StacksMotion />
    </section>
  );
}
