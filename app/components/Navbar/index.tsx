"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./Navbar.module.css";

const links = [
  { href: "#about", label: "About" },
  { href: "#stacks", label: "Stacks" },
  { href: "#glimpses", label: "Glimpses" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = () => menuRef.current?.hidePopover();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpointChange = () => {
      if (desktop.matches) menuRef.current?.hidePopover();
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
          popoverTarget="mobile-navigation"
          aria-label="Toggle navigation menu"
        >
          <span className={styles.toggleLabel} aria-hidden="true">
            <span className={styles.openLabel}>Menu</span>
            <span className={styles.closeLabel}>Close</span>
          </span>
          <span className={styles.hamburger} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        <div
          className={styles.mobileMenu}
          id="mobile-navigation"
          popover="auto"
          ref={menuRef}
          aria-label="Explore Exodia"
        >
          <div className={styles.menuHeading}>
            <span className={styles.menuEyebrow}>Your next chapter</span>
          </div>
          <ul className={styles.menuLinks}>
            {links.map(({ href, label }, index) => (
              <li className={styles.menuItem} key={href}>
                <a className={styles.menuLink} href={href} onClick={closeMenu}>
                  <span className={styles.linkNumber} aria-hidden="true">
                    0{index + 1}
                  </span>
                  <span>{label}</span>
                  <span className={styles.linkArrow} aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.menuFooter}>
            <p>A little curiosity. A little magic.</p>
            <RegisterButton onClick={closeMenu} />
          </div>
        </div>
      </nav>
    </header>
  );
}

function RegisterButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className={styles.register}
      type="button"
      popoverTarget="registration-note"
      onClick={onClick}
    >
      <span className={styles.registerLabel}>Register</span>
      <span className={styles.arrow} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
        <svg className={styles.arrowCopy} viewBox="0 0 24 24" fill="none">
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
      </span>
    </button>
  );
}
