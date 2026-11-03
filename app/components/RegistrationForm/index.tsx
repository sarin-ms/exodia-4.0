"use client";

import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import CodeSlots from "@/app/components/CodeSlots";
import CollegeAutocomplete from "@/app/components/CollegeAutocomplete";
import SlideCommit from "@/app/components/SlideCommit";
import { stacks } from "@/app/content/stacks";
import {
  formatRupees,
  studyYears,
  yearLabels,
  type StudentDetails,
} from "@/app/lib/registration";
import useRegistrationForm from "./useRegistrationForm";
import styles from "./RegistrationForm.module.css";

const labels: Record<keyof StudentDetails, string> = {
  name: "Full name",
  college: "College",
  year: "Year of study",
  email: "Email address",
  phone: "Phone number",
  gender: "Gender",
  food: "Food preference",
  stackId: "Learning stack",
};
const stepLabels = ["Details", "Your stack", "Review", "Your pass"];

export default function RegistrationForm({ apiUrl }: { apiUrl: string }) {
  const form = useRegistrationForm(apiUrl);
  const { student, errors, checkout, step } = form;
  const stackTitle = stacks.find(
    (stack) => stack.id === student.stackId,
  )?.title;
  const confirmed = checkout?.status === "confirmed";
  const resendSeconds = form.verification
    ? Math.max(0, Math.ceil(form.verification.resendAt - form.clockTime))
    : 0;
  const rows = [
    ["Name", student.name],
    ["Email", student.email],
    ["Phone", student.phone],
    ["College", student.college],
    ["Year", yearLabels[student.year]],
    ["Gender", student.gender === "male" ? "Male" : "Female"],
    ["Food", student.food === "veg" ? "Vegetarian" : "Non-vegetarian"],
  ];
  const fieldError = (field: keyof StudentDetails) =>
    errors[field] ? (
      <span className={styles.fieldError} id={field + "-error"}>
        {errors[field]}
      </span>
    ) : null;
  function input(
    field: "name" | "college" | "email" | "phone",
    placeholder: string,
    autoComplete: string,
    type = "text",
  ) {
    return (
      <label className={styles.field} htmlFor={field}>
        <span>
          {labels[field]} <span className={styles.required}>*</span>
        </span>
        <input
          id={field}
          name={field}
          type={type}
          value={student[field]}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          maxLength={
            field === "email"
              ? 254
              : field === "college"
                ? 160
                : field === "phone"
                  ? 24
                  : 100
          }
          aria-invalid={!!errors[field]}
          aria-describedby={errors[field] ? field + "-error" : undefined}
          onChange={(event) => form.update(field, event.target.value)}
        />
        {fieldError(field)}
      </label>
    );
  }
  function choice(field: "gender" | "food", options: [string, string][]) {
    return (
      <fieldset
        className={styles.choiceField}
        id={field}
        tabIndex={-1}
        aria-describedby={errors[field] ? field + "-error" : undefined}
      >
        <legend>
          {labels[field]} <span className={styles.required}>*</span>
        </legend>
        <div className={styles.choices}>
          {options.map(([value, label]) => (
            <label key={value}>
              <input
                type="radio"
                name={field}
                value={value}
                required
                checked={student[field] === value}
                onChange={() => form.update(field, value)}
              />
              <span>
                <span className={styles.radioDot} />
                {label}
              </span>
            </label>
          ))}
        </div>
        {fieldError(field)}
      </fieldset>
    );
  }
  const errorSummary = Object.values(errors).some(Boolean) && (
    <div
      className={styles.errorSummary}
      ref={form.errorRef}
      tabIndex={-1}
      role="alert"
    >
      <strong>A few details need your attention.</strong>
      <ul>
        {Object.entries(errors)
          .filter(([, value]) => value)
          .map(([field, value]) => (
            <li key={field}>
              <a href={"#" + field}>{value}</a>
            </li>
          ))}
      </ul>
    </div>
  );
  return (
    <div className={styles.page}>
      <div className={styles.scenery} aria-hidden="true">
        <Image
          className={styles.castle}
          src="/images/hero/academy-castle-mobile.webp"
          alt=""
          width={1000}
          height={563}
          sizes="(min-width: 1100px) 640px, 380px"
        />
        <span className={styles.starOne}>✦</span>
        <span className={styles.starTwo}>✧</span>
      </div>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Exodia 4.0 home">
          <Image
            src="/brand/exodia-mark.svg"
            alt=""
            width={32}
            height={32}
            unoptimized
          />
          <span>
            exodia <small>4.0</small>
          </span>
        </Link>
        <span className={styles.headerLabel}>THE NEXT CHAPTER</span>
        <Link className={styles.back} href="/">
          Back to home <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <main className={styles.main} id="main">
        <div className={styles.intro}>
          <div className={styles.introText}>
            <p className={styles.eyebrow}>
              <span aria-hidden="true">✦</span> EXODIA 4.0 / REGISTRATION
            </p>
            <h1>
              Your next chapter.
              <br />
              <span>A little more magical.</span>
            </h1>
            <p className={styles.introCopy}>
              Come curious. Find your stack. Make something extraordinary.
            </p>
          </div>
          <div className={styles.introArt} aria-hidden="true">
            <Image
              className={styles.hat}
              src="/images/hero/sorting-hat.png"
              alt=""
              width={1254}
              height={1254}
              sizes="(min-width: 640px) 140px, 90px"
            />
            <span>
              Every great story
              <br />
              starts somewhere.
            </span>
          </div>
        </div>
        <div className={styles.feeSummary}>
          <span className={styles.passLabel}>
            <span aria-hidden="true">✧</span> Student pass{" "}
            <small>ONE STUDENT · ONE STACK</small>
          </span>
          <strong>
            {formatRupees(checkout?.amount ?? form.amount)}
            <small> / person</small>
          </strong>
        </div>
        <section
          className={styles.panel}
          aria-label="Student registration"
          aria-busy={form.busy}
        >
          <nav className={styles.stepper} aria-label="Registration progress">
            <ol className={styles.steps}>
              {stepLabels.map((label, index) => (
                <li
                  key={label}
                  data-active={step === index}
                  data-done={step > index}
                >
                  <button
                    type="button"
                    disabled={index >= step || step === 3 || form.busy}
                    aria-current={step === index ? "step" : undefined}
                    aria-label={
                      label +
                      (step > index ? ", completed. Edit this step" : "")
                    }
                    onClick={() => form.setStep(index)}
                  >
                    <span className={styles.stepNumber}>
                      {step > index ? "✓" : "0" + (index + 1)}
                    </span>
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          {step === 0 && (
            <form
              className={styles.form}
              noValidate
              aria-label="Your contact details"
              onSubmit={(event) => {
                event.preventDefault();
                form.continueDetails();
              }}
            >
              <div className={styles.heading}>
                <div>
                  <h2 ref={form.headingRef} tabIndex={-1}>
                    Make your entry.
                  </h2>
                  <p>A few details to begin your Exodia story.</p>
                </div>
                <span className={styles.stepCounter}>
                  01 <small>/ 04</small>
                </span>
              </div>
              {errorSummary}

              <div className={styles.fields}>
                {input("name", "Your full name", "name")}
                {input("email", "you@example.com", "email", "email")}
                {input("phone", "98765 43210", "tel", "tel")}
                {choice("gender", [
                  ["male", "Male"],
                  ["female", "Female"],
                ])}
              </div>
              <div className={styles.formActions}>
                <span className={styles.actionHint}>
                  Next up: your college & learning stack
                </span>
                <button className={styles.primary} type="submit">
                  Continue <span aria-hidden="true">→</span>
                </button>
              </div>
              <p className={styles.footnote}>
                One event per email address and mobile number. Already
                registered? <Link href="/ticket">Find your ticket ↗</Link>
              </p>
            </form>
          )}
          {step === 1 && (
            <form
              className={styles.form}
              noValidate
              aria-label="College and learning stack"
              onSubmit={(event) => {
                event.preventDefault();
                void form.review();
              }}
            >
              <div className={styles.heading}>
                <div>
                  <h2 ref={form.headingRef} tabIndex={-1}>
                    Find your kind of magic.
                  </h2>
                  <p>Tell us where you’re from, and what you want to build.</p>
                </div>
                <span className={styles.stepCounter}>
                  02 <small>/ 04</small>
                </span>
              </div>
              {errorSummary}
              <div className={styles.fields}>
                <CollegeAutocomplete
                  value={student.college}
                  onChange={(college) => form.update("college", college)}
                  error={errors.college}
                />
                <label className={styles.field} htmlFor="year">
                  <span>
                    Year of study <span className={styles.required}>*</span>
                  </span>
                  <select
                    id="year"
                    name="year"
                    value={student.year}
                    required
                    aria-invalid={!!errors.year}
                    aria-describedby={errors.year ? "year-error" : undefined}
                    onChange={(event) =>
                      form.update("year", event.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select your year
                    </option>
                    {studyYears.map((year) => (
                      <option value={year} key={year}>
                        {yearLabels[year]}
                      </option>
                    ))}
                  </select>
                  {fieldError("year")}
                </label>
              </div>
              {choice("food", [
                ["veg", "Vegetarian"],
                ["non-veg", "Non-vegetarian"],
              ])}
              <fieldset
                className={styles.stackField}
                id="stackId"
                tabIndex={-1}
                aria-describedby={
                  errors.stackId ? "stackId-error" : "stack-hint"
                }
              >
                <legend>
                  Your learning stack <span className={styles.required}>*</span>
                </legend>
                <p id="stack-hint">
                  Choose one. Spend the day making it yours.
                </p>
                <div className={styles.stackChoices}>
                  {stacks.map((stack, index) => {
                    const available = form.catalogue?.stacks.find(
                      (value) => value.id === stack.id,
                    )?.available;
                    const disabled = !!form.catalogue?.salesOpen && !available;
                    return (
                      <label key={stack.id} data-disabled={disabled}>
                        <input
                          type="radio"
                          name="stackId"
                          value={stack.id}
                          checked={student.stackId === stack.id}
                          disabled={disabled}
                          required
                          onChange={() => form.update("stackId", stack.id)}
                        />
                        <Image
                          className={styles.stackImage}
                          src={stack.image}
                          alt=""
                          width={120}
                          height={120}
                          sizes="56px"
                        />
                        <span className={styles.stackCopy}>
                          <small>STACK 0{index + 1}</small>
                          <strong>{stack.title}</strong>
                          <span>
                            {disabled ? "Currently unavailable" : stack.motif}
                          </span>
                        </span>
                        <span
                          className={styles.stackRadio}
                          aria-hidden="true"
                        />
                      </label>
                    );
                  })}
                </div>
                {fieldError("stackId")}
              </fieldset>
              <div className={styles.formActions}>
                <button
                  className={styles.textButton}
                  type="button"
                  disabled={form.busy}
                  onClick={() => form.setStep(0)}
                >
                  ← Back
                </button>
                <button
                  className={styles.primary}
                  type="submit"
                  disabled={form.busy}
                >
                  {form.busy ? "Sending your code…" : "Review my registration"}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <div className={styles.form}>
              <div className={styles.heading}>
                <div>
                  <h2 ref={form.headingRef} tabIndex={-1}>
                    One last look.
                  </h2>
                  <p>Your next chapter is almost booked.</p>
                </div>
                <span className={styles.stepCounter}>
                  03 <small>/ 04</small>
                </span>
              </div>
              <div className={styles.reviewTitle}>
                <h3>Your details</h3>
                <button
                  className={styles.textButton}
                  type="button"
                  disabled={form.busy}
                  onClick={() => form.setStep(0)}
                >
                  Edit details ↗
                </button>
              </div>
              <dl className={styles.reviewDetails}>
                {rows.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <section
                className={styles.verification}
                aria-labelledby="email-verification-title"
              >
                <div className={styles.reviewTitle}>
                  <h3 id="email-verification-title">Verify your email</h3>
                  {form.emailVerified && (
                    <span className={styles.verifiedBadge}>✓ VERIFIED</span>
                  )}
                </div>
                <p>
                  {form.emailVerified
                    ? "Your pass will be sent to "
                    : form.verification
                      ? "Enter the six-digit code sent to "
                      : "We’ll send a six-digit code to "}
                  <strong>{student.email}</strong>.
                </p>
                {!form.emailVerified && (
                  <form
                    className={styles.otpForm}
                    noValidate
                    onSubmit={(event) => {
                      event.preventDefault();
                      void form.confirmCode();
                    }}
                  >
                    {form.verification && (
                      <>
                        <CodeSlots
                          value={form.code}
                          onChange={(code) => {
                            form.setCode(code);
                            if (code) form.setCodeError("");
                          }}
                          status={form.codeError ? "error" : "idle"}
                          disabled={form.busy}
                          slotSize={36}
                          gap={6}
                          radius={9}
                          accentColor="var(--color-gold)"
                          inkColor="var(--color-text)"
                          slotColor="var(--color-surface)"
                          digitColor="var(--color-cinder)"
                          dangerColor="var(--color-error)"
                          ariaLabel="Six-digit email verification code"
                          describedBy="code-hint code-error"
                        />
                        <small id="code-hint">
                          Valid for 10 minutes. Check your spam folder too.
                        </small>
                        <button
                          className={styles.verifyButton}
                          type="submit"
                          disabled={form.busy || form.code.length !== 6}
                        >
                          {form.busy ? "Checking code…" : "Verify email"}
                          <span aria-hidden="true">→</span>
                        </button>
                      </>
                    )}
                    <span
                      className={styles.fieldError}
                      id="code-error"
                      role="status"
                    >
                      {form.codeError}
                    </span>
                    <div className={styles.inlineActions}>
                      <button
                        className={styles.textButton}
                        type="button"
                        disabled={
                          form.busy ||
                          !form.catalogue?.emailReady ||
                          resendSeconds > 0
                        }
                        onClick={() => {
                          void form.sendCode();
                        }}
                      >
                        {form.busy && !form.verification
                          ? "Sending code…"
                          : resendSeconds > 0
                            ? "Resend in " + resendSeconds + "s"
                            : form.verification
                              ? "Resend code"
                              : "Send verification code"}
                      </button>
                      <button
                        className={styles.textButton}
                        type="button"
                        disabled={form.busy}
                        onClick={() => form.setStep(0)}
                      >
                        Change email ↗
                      </button>
                    </div>
                    {!form.catalogue?.emailReady && (
                      <p className={styles.notice}>
                        Email verification opens soon. Please check back
                        shortly.
                      </p>
                    )}
                  </form>
                )}
              </section>
              <div className={styles.total}>
                <div className={styles.reviewTitle}>
                  <span>YOUR STUDENT PASS</span>
                  <button
                    className={styles.textButton}
                    type="button"
                    disabled={form.busy}
                    onClick={() => form.setStep(1)}
                  >
                    Change stack ↗
                  </button>
                </div>
                <h3>{stackTitle}</h3>
                <p>One student · One learning stack</p>
                <div className={styles.totalPrice}>
                  <span>Total payable</span>
                  <strong>{formatRupees(form.amount)}</strong>
                </div>
              </div>
              {form.emailVerified &&
                (!form.catalogue?.salesOpen || !form.canPay) && (
                  <p className={styles.notice} role="status">
                    {form.scriptFailed
                      ? "Secure checkout couldn’t load. Refresh and try again."
                      : form.catalogueLoading
                        ? "Checking availability…"
                        : !form.catalogue?.salesOpen
                          ? (form.catalogue?.message ??
                            "Registration opens soon.")
                          : !form.scriptReady
                            ? "Loading secure checkout…"
                            : "This stack is currently unavailable. Please edit your selection."}
                  </p>
                )}
              <div className={styles.paymentAction}>
                <SlideCommit
                  label={"Slide to pay " + formatRupees(form.amount)}
                  doneLabel="Checkout opened"
                  errorLabel="Try again"
                  disabled={!form.canPay || form.busy}
                  width={720}
                  height={58}
                  radius={12}
                  trackColor="var(--color-surface)"
                  handleColor="var(--color-gold)"
                  successColor="var(--color-gold)"
                  dangerColor="var(--color-error)"
                  onConfirm={async () => {
                    if (!(await form.pay()))
                      throw new Error("Checkout could not open");
                  }}
                />
              </div>
              <p className={styles.footnote}>
                {form.emailVerified
                  ? "Secured by Razorpay · Your seat is held for 10 minutes."
                  : "Verify your email to unlock secure checkout."}
              </p>
            </div>
          )}
          {step === 3 && (
            <div className={styles.form + " " + styles.result}>
              <span className={styles.largeSymbol} aria-hidden="true">
                {confirmed ? "✦" : "✧"}
              </span>
              <div className={styles.heading}>
                <h2 ref={form.headingRef} tabIndex={-1}>
                  {confirmed
                    ? "You’re on the list."
                    : !checkout
                      ? "Let’s reconnect."
                      : checkout?.status === "paid_exception"
                        ? "Your booking needs a closer look."
                        : checkout?.status === "refunded"
                          ? "Your payment was refunded."
                          : checkout?.status === "expired"
                            ? "Your seat hold has ended."
                            : "Checking your payment."}
                </h2>
                <p>
                  {confirmed
                    ? checkout.ticketUrl
                      ? "Your payment is verified. Your pass is ready for its next chapter."
                      : "Your payment is verified and your registration is confirmed. Save your reference below."
                    : !checkout
                      ? "We couldn’t retrieve your saved registration. Retry the connection to check its status."
                      : checkout?.status === "paid_exception"
                        ? "Your payment needs review. Contact the Exodia team with your reference before paying again."
                        : "If money was debited, check your status before making another payment."}
                </p>
              </div>
              {checkout && (
                <div className={styles.reference}>
                  <span>REGISTRATION REFERENCE</span>
                  <strong>{checkout.reference}</strong>
                  <small>
                    {formatRupees(checkout.amount)} ·{" "}
                    {checkout.status.replaceAll("_", " ")}
                  </small>
                </div>
              )}
              {confirmed && checkout.ticketUrl && (
                <>
                  <Link className={styles.primary} href={checkout.ticketUrl}>
                    Open my ticket <span aria-hidden="true">↗</span>
                  </Link>
                  <p className={styles.footnote}>
                    {checkout.ticketEmailStatus === "sent"
                      ? "Your ticket email has been sent. Check your inbox."
                      : "Your ticket is ready. Email delivery is pending; you can open your pass above."}
                  </p>
                </>
              )}
              {!confirmed && (
                <button
                  className={styles.primary}
                  type="button"
                  disabled={form.busy}
                  onClick={() => {
                    void form.refreshStatus();
                  }}
                >
                  {form.busy
                    ? "Checking…"
                    : checkout
                      ? "Check payment status"
                      : "Retry connection"}
                  <span aria-hidden="true">↗</span>
                </button>
              )}
              {checkout?.status === "pending_payment" &&
                checkout.paymentMode === form.catalogue?.paymentMode &&
                checkout.orderId &&
                checkout.expiresAt > form.clockTime && (
                  <button
                    className={styles.secondary}
                    type="button"
                    disabled={!form.scriptReady || form.busy}
                    onClick={() => form.openCheckout(checkout)}
                  >
                    Resume secure checkout ↗
                  </button>
                )}
              <Link className={styles.support} href="/#contact">
                Contact the Exodia team ↗
              </Link>
              {(confirmed ||
                checkout?.status === "expired" ||
                checkout?.status === "refunded") && (
                <button
                  className={styles.textButton}
                  type="button"
                  onClick={form.restart}
                >
                  {confirmed
                    ? "Register another student"
                    : "Start a new registration"}
                </button>
              )}
            </div>
          )}
          {form.message && (
            <p
              className={styles.notice + " " + styles.formNotice}
              role="status"
              aria-live="polite"
            >
              {form.message}
            </p>
          )}
          <div className={styles.panelFooter}>
            <span>
              <span aria-hidden="true">✧</span> A LITTLE CURIOSITY. A LITTLE
              MAGIC.
            </span>
            <Link href="/#contact">Need a hand? ↗</Link>
          </div>
        </section>
        <div className={styles.footer}>
          <span>EXODIA 4.0 · LEARN. BUILD. BELONG.</span>
          <span>
            <span aria-hidden="true">◇</span> Secured by Razorpay
          </span>
        </div>
        <div className={styles.snitch} aria-hidden="true">
          <Image
            className={styles.snitchLeft}
            src="/images/hero/snitch-wing.png"
            alt=""
            width={180}
            height={180}
            sizes="70px"
          />
          <Image
            className={styles.snitchBody}
            src="/images/hero/snitch-body.png"
            alt=""
            width={100}
            height={100}
            sizes="32px"
          />
          <Image
            className={styles.snitchRight}
            src="/images/hero/snitch-wing.png"
            alt=""
            width={180}
            height={180}
            sizes="70px"
          />
        </div>
      </main>
      {step >= 2 && (
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
          onReady={() => form.setScriptReady(true)}
          onError={() => form.setScriptFailed(true)}
        />
      )}
    </div>
  );
}
