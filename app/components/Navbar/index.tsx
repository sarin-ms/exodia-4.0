"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./Navbar.module.css";

const links = [
  { href: "#about", label: "About", description: "The story behind the magic" },
  { href: "#stacks", label: "Stacks", description: "Find your kind of wizardry" },
  {
    href: "#glimpses",
    label: "Glimpses",
    description: "Memories from the great hall",
  },
  { href: "#faq", label: "FAQ", description: "A few answers before you enter" },
];

export default function Navbar() {
  const menuRef = useRef<HTMLDialogElement>(null);
  const closeMenu = () => menuRef.current?.close();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpointChange = () => {
      if (desktop.matches) menuRef.current?.close();
    };

    desktop.addEventListener("change", onBreakpointChange);
    return () => desktop.removeEventListener("change", onBreakpointChange);
  }, []);

  return (
    <header className={styles.header}>
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>
      <nav className={styles.navbar} aria-label="Main navigation">
        <a className={styles.brand} href="#home" aria-label="Exodia 4.0 home">
          <Image
            src="/brand/exodia-mark.svg"
            alt=""
            width={42}
            height={42}
            loading="eager"
            unoptimized
          />
          <span className={styles.brandName} aria-hidden="true">
            exodia<span>4.0</span>
          </span>
        </a>
        <div className={styles.actions}>
          {links.map(({ href, label }) => (
            <a className={styles.aboutLink} href={href} key={href}>
              {label}
            </a>
          ))}
          <RegisterButton />
        </div>
        <button
          className={styles.menuToggle}
          type="button"
          onClick={() => menuRef.current?.showModal()}
          aria-label="Open navigation menu"
          aria-haspopup="dialog"
          aria-controls="mobile-navigation"
        >
          <span className={styles.hamburger} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        <dialog
          className={styles.mobileMenu}
          id="mobile-navigation"
          ref={menuRef}
          aria-labelledby="mobile-menu-title"
        >
          <div className={styles.menuStage}>
            <div className={styles.menuTopbar}>
              <a
                className={styles.menuBrand}
                href="#home"
                aria-label="Exodia 4.0 home"
                onClick={closeMenu}
              >
                <span className={styles.menuWordmark} aria-hidden="true">
                  exodia
                </span>
                <span className={styles.menuEdition}>Chapter IV</span>
              </a>
              <button
                className={styles.menuClose}
                type="button"
                onClick={closeMenu}
                aria-label="Close navigation menu"
              >
                <span>Close</span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m6 6 12 12M6 18 18 6" />
                </svg>
              </button>
            </div>

            <div className={styles.menuBody}>
              <div className={styles.parchment}>
                <div className={styles.menuHeading}>
                  <span className={styles.menuEyebrow}>The sorting room</span>
                  <h2 id="mobile-menu-title">
                    Where to,<br />curious one?
                  </h2>
                  <div className={styles.hatScene} aria-hidden="true">
                    <span className={styles.hatOrbit} />
                    <span className={styles.hatSpark}>✧</span>
                    <Image
                      className={styles.menuHat}
                      src="/images/hero/sorting-hat.png"
                      alt=""
                      width={200}
                      height={200}
                      sizes="(max-width: 359px) 140px, 180px"
                    />
                  </div>
                </div>

                <ul className={styles.menuLinks}>
                  {links.map(({ href, label, description }, index) => (
                    <li className={styles.menuItem} key={href}>
                      <a
                        className={styles.menuLink}
                        href={href}
                        onClick={closeMenu}
                      >
                        <span className={styles.linkNumber} aria-hidden="true">
                          0{index + 1}
                        </span>
                        <span className={styles.linkCopy}>
                          <span className={styles.linkTitle}>{label}</span>
                          <span className={styles.linkDescription}>
                            {description}
                          </span>
                        </span>
                        <span className={styles.linkArrow} aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <div className={styles.menuFooter}>
                  <RegisterButton onClick={closeMenu} />
                </div>
              </div>
              <p className={styles.menuNote}>
                <span aria-hidden="true">✦</span> A little curiosity. A little magic.
              </p>
            </div>
          </div>
        </dialog>
      </nav>
    </header>
  );
}

function RegisterButton({ onClick }: { onClick?: () => void }) {
  return (
    <Link className={styles.register} href="/register" onClick={onClick}>
      <span className={styles.registerLabel}>Register</span>
      <span className={styles.arrow} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
        <svg className={styles.arrowCopy} viewBox="0 0 24 24" fill="none">
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
      </span>
    </Link>
  );
}
