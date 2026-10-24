import FooterMotion from "@/app/components/FooterMotion";
import Magnet from "@/app/components/Magnet";
import { footerContact, footerSocials } from "@/app/content/footer";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer
      className={styles.footer}
      id="contact"
      aria-labelledby="footer-heading"
      tabIndex={-1}
    >
      <div className={styles.atmosphere} aria-hidden="true" />
      <span
        className={styles.lightTrail}
        data-footer-trail
        aria-hidden="true"
      />
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.identity} data-footer-reveal>
            <p className={styles.brand}>
              <span className={styles.wordmark} data-footer-wordmark>
                exodia
              </span>
              <span className={styles.edition}>4.0</span>
            </p>
            <h2 className={styles.heading} id="footer-heading">
              Come curious. <span>Leave extraordinary.</span>
            </h2>
          </div>
          <div className={styles.contact} data-footer-reveal>
            <p className={styles.label}>A question. An idea. A hello.</p>
            <a className={styles.email} href={`mailto:${footerContact.email}`}>
              {footerContact.email}
              <span aria-hidden="true">↗</span>
            </a>
            <ul className={styles.phones} aria-label="Exodia contacts">
              {[1, 2, 3].map((number) => (
                <li key={number}>
                  <a
                    className={styles.phone}
                    href={footerContact.phoneHref}
                    aria-label={`Call Exodia contact ${number}: ${footerContact.phoneCountry} ${footerContact.phoneLabel}`}
                  >
                    <span className={styles.phoneCountry}>
                      {footerContact.phoneCountry}
                    </span>
                    <span>{footerContact.phoneLabel}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.action} data-footer-reveal>
            <Magnet maxOffset={6}>
              <button
                className={styles.join}
                type="button"
                popoverTarget="registration-note"
                aria-label="Get Exodia registration updates"
              >
                <span className={styles.joinCopy}>
                  <span className={styles.joinStatus}>Opening soon</span>
                  <span className={styles.joinLabel}>Get updates</span>
                </span>
                <span className={styles.joinArrow} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 19L19 5M5 5H19V19" />
                  </svg>
                </span>
              </button>
            </Magnet>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Exodia</p>
          <ul className={styles.socials} aria-label="Exodia social channels">
            {footerSocials.map((social) => (
              <li key={social.icon}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Exodia on ${social.name} (opens in a new tab)`}
                >
                  <SocialIcon name={social.icon} />
                  <span className={styles.socialName}>{social.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <FooterMotion />
    </footer>
  );
}

function SocialIcon({
  name,
}: {
  name: (typeof footerSocials)[number]["icon"];
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {name === "instagram" && (
        <>
          <rect x="4" y="4" width="16" height="16" rx="4.5" />
          <circle cx="12" cy="12" r="3.5" />
          <circle className={styles.iconFill} cx="17" cy="7" r="0.8" />
        </>
      )}
      {name === "youtube" && (
        <>
          <path d="M20.3 7.2C20 6 19.1 5.6 18 5.4C15.5 5.1 8.5 5.1 6 5.4C4.9 5.6 4 6 3.7 7.2C3.2 9.5 3.2 14.5 3.7 16.8C4 18 4.9 18.4 6 18.6C8.5 18.9 15.5 18.9 18 18.6C19.1 18.4 20 18 20.3 16.8C20.8 14.5 20.8 9.5 20.3 7.2Z" />
          <path d="M10 9L15 12L10 15V9Z" />
        </>
      )}
      {name === "facebook" && (
        <path d="M14.5 21V13.1H17L17.4 10H14.5V8C14.5 7.1 14.8 6.5 16 6.5H17.5V3.7C17 3.6 16.1 3.5 15.1 3.5C12.7 3.5 11 5 11 7.7V10H8.5V13.1H11V21H14.5Z" />
      )}
    </svg>
  );
}
