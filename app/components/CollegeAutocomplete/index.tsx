"use client";

import { useEffect, useId, useRef, useState } from "react";
import { colleges } from "@/app/content/colleges";
import styles from "./CollegeAutocomplete.module.css";

type CollegeAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export default function CollegeAutocomplete({
  value,
  onChange,
  error,
}: CollegeAutocompleteProps) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const activeOptionRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const query = value.trim().toLocaleLowerCase();
  const suggestions = query.length < 2 ? [] : colleges
    .filter((college) => college.toLocaleLowerCase().includes(query))
    .slice(0, 8);
  const expanded = open && suggestions.length > 0;

  useEffect(() => {
    if (expanded && activeIndex >= 0)
      activeOptionRef.current?.scrollIntoView({ block: "nearest" });
  }, [expanded, activeIndex]);

  function select(college: string) {
    onChange(college);
    inputRef.current?.focus();
    setOpen(false);
    setActiveIndex(-1);
  }

  return (
    <div className={styles.field} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <label htmlFor="college">College <span className={styles.required}>*</span></label>
      <div className={styles.control}>
        <input
          ref={inputRef}
          id="college"
          name="college"
          role="combobox"
          type="text"
          value={value}
          placeholder="Search or enter your college"
          autoComplete="off"
          required
          maxLength={160}
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={expanded ? listId : undefined}
          aria-activedescendant={expanded && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? "college-error" : "college-hint"}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={(event) => {
            if ((event.key === "ArrowDown" || event.key === "ArrowUp") && suggestions.length) {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((current) => event.key === "ArrowDown"
                ? Math.min(current + 1, suggestions.length - 1)
                : current <= 0 ? suggestions.length - 1 : current - 1);
            } else if (event.key === "Enter" && expanded && activeIndex >= 0) {
              event.preventDefault();
              select(suggestions[activeIndex]);
            } else if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
              setActiveIndex(-1);
            }
          }}
        />
        {expanded && (
          <ul className={styles.suggestions} id={listId} role="listbox" aria-label="College suggestions">
            {suggestions.map((college, index) => (
              <li key={college} role="presentation">
                <button
                    ref={activeIndex === index ? activeOptionRef : undefined}
                    type="button"
                    role="option"
                    id={`${listId}-${index}`}
                    tabIndex={-1}
                    aria-selected={activeIndex === index}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => select(college)}
                  >{college}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error
        ? <span className={styles.error} id="college-error">{error}</span>
        : <span className={styles.hint} id="college-hint">Search for your college, or enter its full name.</span>}
    </div>
  );
}
