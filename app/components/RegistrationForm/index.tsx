"use client";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import RegistrationPass from "@/app/components/RegistrationPass";
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
export default function RegistrationForm({ apiUrl }: { apiUrl: string }) {
  const form = useRegistrationForm(apiUrl);
  const { student, errors, checkout, step } = form;
  const stackTitle = stacks.find(
    (stack) => stack.id === student.stackId,
  )?.title;
  const confirmed = checkout?.status === "confirmed";
  const razorpayTest = checkout?.paymentMode === "test";
  const rows = [
    ["Name", student.name],
    ["College", student.college],
    ["Year", yearLabels[student.year]],
    ["Email", student.email],
    ["Phone", student.phone],
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
        <span>{labels[field]}</span>
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
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Exodia 4.0 home">
          <Image
            src="/brand/exodia-mark.svg"
            alt=""
            width={34}
            height={34}
            unoptimized
          />
          <span>
            exodia <small>4.0</small>
          </span>
        </Link>
        <Link className={styles.back} href="/#stacks">
          Explore the stacks <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <main className={styles.main} id="main">
        <aside className={styles.intro}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true">✦</span> THE NEXT CHAPTER IS YOURS
          </p>
          <h1>
            Come curious.
            <br />
            <span>Leave extraordinary.</span>
          </h1>
          <p className={styles.introCopy}>
            A room full of ideas. A stack worth exploring. And a whole new
            version of what you can build.
          </p>
          <div className={styles.passWrap}>
            <RegistrationPass
              amount={checkout?.amount ?? form.amount}
              stackTitle={stackTitle}
            />
          </div>
          <div className={styles.facts}>
            <span>
              <strong>03</strong> learning stacks
            </span>
            <span>
              <strong>60</strong> seats per stack
            </span>
            <span>
              <strong>01</strong> next chapter
            </span>
          </div>
        </aside>
        <section className={styles.panel} aria-label="Student registration">
          <div className={styles.panelTop}>
            <span>STUDENT REGISTRATION</span>
            <span>EXODIA / 4.0</span>
          </div>
          <ol className={styles.steps} aria-label="Registration progress">
            {["Details", "Verify email", "Review & pay", "Your pass"].map(
              (label, index) => (
                <li
                  key={label}
                  data-active={step === index}
                  data-done={step > index}
                  aria-current={step === index ? "step" : undefined}
                >
                  <span>{step > index ? "✓" : "0" + (index + 1)}</span>
                  <span>{label}</span>
                </li>
              ),
            )}
          </ol>
          {step === 0 && (
            <form
              className={styles.form}
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                void form.review();
              }}
            >
              <div className={styles.heading}>
                <h2 ref={form.headingRef} tabIndex={-1}>
                  Let’s make it official.
                </h2>
                <p>A few details, a stack you love, and you’re on your way.</p>
              </div>
              {Object.values(errors).some(Boolean) && (
                <div
                  className={styles.errorSummary}
                  ref={form.errorRef}
                  tabIndex={-1}
                  role="alert"
                >
                  <strong>Check these details before continuing.</strong>
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
              )}
              <div className={styles.sectionLabel}>
                <span>01</span>
                <h3>A little about you</h3>
                <span>ALL FIELDS REQUIRED</span>
              </div>
              <div className={styles.fields}>
                {input("name", "Your full name", "name")}
                {input(
                  "college",
                  "Your college or institution",
                  "organization",
                )}
                {input("email", "you@example.com", "email", "email")}
                {input("phone", "+91 98765 43210", "tel", "tel")}
              </div>
              <div className={styles.preferences}>
                <label className={styles.field} htmlFor="year">
                  <span>Year of study</span>
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
                      Select year
                    </option>
                    {studyYears.map((year) => (
                      <option value={year} key={year}>
                        {yearLabels[year]}
                      </option>
                    ))}
                  </select>
                  {fieldError("year")}
                </label>
                {(
                  [
                    [
                      "gender",
                      [
                        ["male", "Male"],
                        ["female", "Female"],
                      ],
                    ],
                    [
                      "food",
                      [
                        ["veg", "Veg"],
                        ["non-veg", "Non-veg"],
                      ],
                    ],
                  ] as const
                ).map(([field, options]) => (
                  <fieldset
                    className={styles.choiceField}
                    id={field}
                    tabIndex={-1}
                    key={field}
                    aria-describedby={
                      errors[field] ? field + "-error" : undefined
                    }
                  >
                    <legend>{labels[field]}</legend>
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
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                    {fieldError(field)}
                  </fieldset>
                ))}
              </div>
              <fieldset
                className={styles.stackField}
                id="stackId"
                tabIndex={-1}
                aria-describedby={
                  errors.stackId ? "stackId-error" : "stack-hint"
                }
              >
                <legend>
                  <span>02</span> Pick your learning stack
                </legend>
                <p id="stack-hint">
                  One stack. A world of possibilities. ₹799 per student.
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
                        <span className={styles.stackIcon} aria-hidden="true">
                          {["AI", "ES", "GD"][index]}
                        </span>
                        <strong>{stack.title}</strong>
                        <small>{disabled ? "Unavailable" : stack.motif}</small>
                        <span className={styles.stackArrow} aria-hidden="true">
                          ↗
                        </span>
                      </label>
                    );
                  })}
                </div>
                {fieldError("stackId")}
              </fieldset>
              <button
                className={styles.primary}
                type="submit"
                disabled={form.busy}
              >
                {form.busy
                  ? "Sending your code…"
                  : "Continue to email verification"}
                <span aria-hidden="true">→</span>
              </button>
              <p className={styles.footnote}>
                We’ll verify your email before payment and send your ticket
                there.
              </p>
            </form>
          )}
          {step === 1 && (
            <form
              className={styles.form}
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                void form.confirmCode();
              }}
            >
              <div className={styles.heading}>
                <span className={styles.largeSymbol} aria-hidden="true">
                  ✉
                </span>
                <h2 ref={form.headingRef} tabIndex={-1}>
                  Check your inbox.
                </h2>
                <p>
                  {form.verification
                    ? "A six-digit code is on its way to"
                    : "We’ll send your verification code to"}
                  <br />
                  <strong>{student.email}</strong>
                </p>
              </div>
              {!form.catalogue?.emailReady && (
                <p className={styles.notice}>
                  Email verification opens soon. Please check back shortly.
                </p>
              )}
              <label className={styles.field} htmlFor="verification-code">
                <span>Verification code</span>
                <input
                  className={styles.codeInput}
                  id="verification-code"
                  name="verification-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={form.code}
                  placeholder="000000"
                  maxLength={6}
                  onChange={(event) =>
                    form.setCode(event.target.value.replace(/\D/g, ""))
                  }
                  required
                  aria-describedby="code-hint"
                />
                <small id="code-hint">
                  Codes expire in 10 minutes. Check your spam folder too.
                </small>
              </label>
              <button
                className={styles.primary}
                type="submit"
                disabled={form.busy || !form.verification}
              >
                {form.busy ? "Checking your code…" : "Verify email & continue"}
                <span aria-hidden="true">→</span>
              </button>
              <div className={styles.inlineActions}>
                <button
                  className={styles.textButton}
                  type="button"
                  disabled={
                    form.busy ||
                    !form.catalogue?.emailReady ||
                    (!!form.verification &&
                      form.verification.resendAt > form.clockTime)
                  }
                  onClick={() => {
                    void form.sendCode();
                  }}
                >
                  {form.verification &&
                  form.verification.resendAt > form.clockTime
                    ? "Wait a minute to resend"
                    : form.verification
                      ? "Resend code"
                      : "Send verification code"}
                </button>
                <button
                  className={styles.textButton}
                  type="button"
                  onClick={() => form.setStep(0)}
                >
                  Edit email ↗
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <div className={styles.form}>
              <div className={styles.heading}>
                <span className={styles.verifiedBadge}>✓ EMAIL VERIFIED</span>
                <h2 ref={form.headingRef} tabIndex={-1}>
                  One last look.
                </h2>
                <p>Your next chapter is almost booked.</p>
              </div>
              <div className={styles.reviewTitle}>
                <h3>Your details</h3>
                <button
                  className={styles.textButton}
                  type="button"
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
              <div className={styles.total}>
                <span>STUDENT PASS</span>
                <h3>{stackTitle}</h3>
                <p>One student · One learning stack</p>
                <div>
                  <span>Total payable</span>
                  <strong>{formatRupees(form.amount)}</strong>
                </div>
              </div>
              {(!form.catalogue?.salesOpen || !form.canPay) && (
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
              <button
                className={styles.primary}
                type="button"
                disabled={!form.canPay || form.busy}
                onClick={() => {
                  void form.pay();
                }}
              >
                {form.busy
                  ? "Preparing checkout…"
                  : "Pay " + formatRupees(form.amount) + " securely"}
                <span aria-hidden="true">↗</span>
              </button>
              <p className={styles.footnote}>
                Secured by Razorpay · Your seat is held for 10 minutes.
              </p>
              {form.catalogue?.paymentMode === "test" && (
                <p className={styles.footnote}>
                  Razorpay is in Test Mode. No money will be charged.
                </p>
              )}
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
                    ? razorpayTest
                      ? "Payment test complete."
                      : "You’re on the list."
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
                    ? razorpayTest
                      ? "Your Razorpay test payment was verified. No money was charged."
                      : checkout.ticketUrl
                        ? "Your payment is verified. Your pass is ready for its next chapter."
                        : "Your payment is verified and your registration is confirmed. Save your reference below."
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
                    {razorpayTest && "Razorpay Test · "}
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
                  {form.busy ? "Checking…" : "Check payment status"}
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
            <p className={styles.notice} role="status" aria-live="polite">
              {form.message}
            </p>
          )}
          <div className={styles.panelFooter}>
            <span>A LITTLE CURIOSITY. A LITTLE MAGIC.</span>
            <Link href="/#contact">Need a hand? ↗</Link>
          </div>
        </section>
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
