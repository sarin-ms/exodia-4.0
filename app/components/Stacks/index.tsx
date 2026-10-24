import Image from "next/image";
import StacksMotion from "@/app/components/StacksMotion";
import { stacks } from "@/app/content/stacks";
import styles from "./Stacks.module.css";

export default function Stacks() {
  return (
    <section className={styles.stacks} id="stacks" aria-labelledby="stacks-heading" tabIndex={-1}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.header} data-book-reveal>
          <div>
            <p className={styles.eyebrow}>The learning collection</p>
            <h2 className={styles.heading} id="stacks-heading">The stacks<span>.</span></h2>
          </div>
          <p className={styles.intro}>Three disciplines.<br />One shared curiosity.</p>
        </header>

        <div className={styles.bookShell} data-spellbook data-book-reveal tabIndex={0} role="region" aria-label="Stack field guide">
          <div className={styles.cover} aria-hidden="true" />
          <div className={styles.pageEdges} aria-hidden="true" />
          <div className={styles.book} data-book>
            {stacks.map((stack, index) => (
              <article className={styles.spread} data-book-spread data-stack={stack.id} key={stack.id} id={`stack-page-${stack.id}`} aria-labelledby={`stack-title-${stack.id}`}>
                <div className={`${styles.page} ${styles.leftPage}`} data-book-left>
                  <p className={styles.runningHead}><span>Exodia / Field notes</span><span>Vol. IV</span></p>
                  <p className={styles.chapterKicker}>Chapter {stack.number}</p>
                  <h3 className={styles.stackTitle} id={`stack-title-${stack.id}`}>{stack.title}</h3>
                  <span className={styles.ornament} aria-hidden="true">◆</span>
                  <p className={styles.description}>{stack.description}</p>
                  <div className={styles.topicsBlock}>
                    <p className={styles.topicsLabel}>Inside this chapter</p>
                    <ul className={styles.topics} aria-label={`${stack.title} areas to explore`}>
                      {stack.topics.map((topic) => <li key={topic}>{topic}</li>)}
                    </ul>
                  </div>
                  <p className={styles.motif}>{stack.motif}</p>
                  <div className={styles.folio}><span>The learning collection</span><span>{String(index * 2 + 1).padStart(2, "0")}</span></div>
                </div>
                <div className={`${styles.page} ${styles.rightPage}`} data-book-right>
                  <p className={styles.plateHeading}><span>Exodia 4.0</span><span>Plate {stack.number}</span></p>
                  <div className={styles.artImage}>
                    <Image className={styles.illustration} src={stack.image} alt="" fill sizes="(min-width: 900px) 430px, 75vw" loading={index === 0 ? "eager" : "lazy"} unoptimized />
                  </div>
                  <p className={styles.plateCaption}>{stack.category}</p>
                  <div className={`${styles.folio} ${styles.rightFolio}`}><span>{stack.title}</span><span>{String(index * 2 + 2).padStart(2, "0")}</span></div>
                </div>
              </article>
            ))}
            <div className={styles.castShadow} data-book-shadow aria-hidden="true" />
            <div className={styles.turningPage} data-book-leaf hidden aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => (
                <div className={styles.pageSlice} data-book-slice key={index}>
                  <div className={`${styles.sliceFace} ${styles.sliceFront}`} data-slice-front>
                    <div className={styles.sliceContent} data-slice-content />
                  </div>
                  <div className={`${styles.sliceFace} ${styles.sliceBack}`} data-slice-back>
                    <div className={styles.sliceContent} data-slice-content />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.spine} aria-hidden="true" />
          <div className={styles.ribbon} aria-hidden="true" />
        </div>

        <fieldset className={styles.chapters} data-book-chapters data-book-reveal>
          <legend className={styles.visuallyHidden}>Choose a stack chapter</legend>
          {stacks.map((stack, index) => (
            <div className={styles.chapter} key={stack.id}>
              <input className={styles.chapterInput} type="radio" name="stack-chapter" id={`stack-choice-${stack.id}`} value={stack.id} defaultChecked={index === 0} aria-controls={`stack-page-${stack.id}`} />
              <label className={styles.chapterLabel} htmlFor={`stack-choice-${stack.id}`}>
                <span className={styles.chapterNumber}>{stack.number}</span>
                <span>{stack.title}</span>
              </label>
            </div>
          ))}
        </fieldset>

        <nav className={styles.controls} aria-label="Turn stack catalogue pages" data-book-controls>
          <button className={styles.previous} type="button" data-book-step="-1" disabled aria-label="Previous stack chapter">
            <span aria-hidden="true">←</span><span>Previous</span>
          </button>
          <div className={styles.playback}>
            <p className={styles.pageStatus} role="status" aria-live="off" data-book-status>01 / 03</p>
            <button className={styles.autoButton} type="button" data-book-auto aria-label="Pause automatic page turns" aria-pressed="true">
              <span className={styles.autoIcon} data-auto-icon aria-hidden="true">Ⅱ</span>
              <span data-auto-label>Auto turn</span>
              <span className={styles.progressTrack} aria-hidden="true"><span data-book-progress /></span>
            </button>
          </div>
          <button className={styles.next} type="button" data-book-step="1" aria-label="Next stack chapter">
            <span>Next chapter</span><span aria-hidden="true">→</span>
          </button>
        </nav>
      </div>
      <StacksMotion />
    </section>
  );
}
