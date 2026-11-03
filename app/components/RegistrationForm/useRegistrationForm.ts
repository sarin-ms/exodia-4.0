"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  normalizeStudent,
  registrationPrice,
  validateStudent,
  type Catalogue,
  type Checkout,
  type EmailVerification,
  type FieldErrors,
  type StudentDetails,
} from "@/app/lib/registration";
import type { RazorpayResult } from "./RegistrationForm.types";

const emptyStudent: StudentDetails = {
  name: "",
  college: "",
  year: "",
  email: "",
  phone: "",
  gender: "",
  food: "",
  stackId: "",
};
const storageKey = "exodia-registration-session-v2";
type Session = {
  token: string;
  key: string;
  registrationId?: string;
  checkoutStarted?: boolean;
};
class RequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public fields?: FieldErrors,
  ) {
    super(message);
  }
}
function saveSession(session: Session | null) {
  try {
    if (session) sessionStorage.setItem(storageKey, JSON.stringify(session));
    else sessionStorage.removeItem(storageKey);
  } catch {
    /* Storage is optional. */
  }
}
export default function useRegistrationForm(apiUrl: string) {
  const [student, setStudent] = useState<StudentDetails>(emptyStudent);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [catalogueLoading, setCatalogueLoading] = useState(true);
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [verification, setVerification] = useState<EmailVerification | null>(
    null,
  );
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [busy, setBusy] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);
  const [clockTime, setClockTime] = useState(0);
  const session = useRef<Session | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(0);
  const errorRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const request = useCallback(
    async <T>(
      path: string,
      body?: unknown,
      active = session.current,
    ): Promise<T> => {
      if (!apiUrl)
        throw new RequestError(
          "Registration is being prepared. Please check back soon.",
          503,
        );
      const response = await fetch(apiUrl + path, {
        method: body === undefined ? "GET" : "POST",
        cache: "no-store",
        signal: AbortSignal.timeout(25000),
        headers: {
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
          ...(active ? { Authorization: "Bearer " + active.token } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      }).catch(() => {
        throw new RequestError(
          "Couldn’t connect to the registration service. Check your connection and try again.",
          0,
        );
      });
      const result = await response.json();
      if (!response.ok)
        throw new RequestError(
          result.error ?? "Please try again shortly.",
          response.status,
          result.fields,
        );
      return result as T;
    },
    [apiUrl],
  );
  const loadCatalogue = useCallback(
    () =>
      request<Catalogue>("/api/catalogue", undefined, null)
        .then((result) => {
          setCatalogue(result);
          return true;
        })
        .catch(() => {
          setCatalogue(null);
          return false;
        })
        .finally(() => setCatalogueLoading(false)),
    [request],
  );
  useEffect(() => {
    let cancelled = false;
    let catalogueRetry: ReturnType<typeof setTimeout> | undefined;
    const refreshCatalogue = async () => {
      const available = await loadCatalogue();
      if (!available && !cancelled)
        catalogueRetry = setTimeout(refreshCatalogue, 5000);
    };
    void refreshCatalogue();
    const restore = async () => {
      try {
        const saved: unknown = JSON.parse(
          sessionStorage.getItem(storageKey) ?? "null",
        );
        if (!saved || typeof saved !== "object") return;
        const value = saved as Session;
        if (
          !/^[a-f0-9]{64}$/.test(value.token) ||
          !/^[a-f0-9-]{36}$/.test(value.key)
        )
          return;
        session.current = value;
        // An email challenge has no payment to restore. Older sessions are
        // checked conservatively because they did not record this distinction.
        if (value.checkoutStarted === false && !value.registrationId) return;
        const result = await request<Checkout>(
          "/api/registration-status?id=" +
            encodeURIComponent(value.registrationId ?? value.key),
          undefined,
          value,
        );
        if (!cancelled) {
          setCheckout(result);
          setStep(3);
        }
      } catch (error) {
        if (
          error instanceof RequestError &&
          error.status === 404 &&
          !session.current?.registrationId
        ) {
          if (!cancelled && session.current) {
            session.current.checkoutStarted = false;
            saveSession(session.current);
          }
          return;
        }
        if (session.current && !cancelled) {
          setStep(3);
          setMessage(
            "Couldn’t reconnect to your saved registration. Retry the connection to check whether a checkout was created.",
          );
        }
      }
    };
    void restore();
    return () => {
      cancelled = true;
      clearTimeout(catalogueRetry);
    };
  }, [loadCatalogue, request]);
  useEffect(() => {
    if (previousStep.current !== step) headingRef.current?.focus();
    previousStep.current = step;
  }, [step]);
  useEffect(() => {
    if (step === 0) return;
    const timer = setInterval(() => setClockTime(Date.now() / 1000), 1000);
    return () => clearInterval(timer);
  }, [step]);
  const checkStatus = useCallback(async () => {
    const active = session.current;
    if (!active) return;
    let result: Checkout;
    try {
      result = await request<Checkout>(
        "/api/registration-status?id=" +
          encodeURIComponent(active.registrationId ?? active.key),
      );
    } catch (error) {
      if (
        error instanceof RequestError &&
        error.status === 404 &&
        !active.registrationId
      ) {
        // A definitive not-found response makes it safe to resume the form.
        // Failed connections and known registrations keep their checkout context.
        active.checkoutStarted = false;
        saveSession(active);
        setCheckout(null);
        setStep(0);
        setMessage("");
        return;
      }
      throw error;
    }
    setCheckout(result);
    if (result.status === "confirmed") setMessage("");
    return result;
  }, [request]);
  const registrationId = checkout?.registrationId;
  const paymentStatus = checkout?.status;
  useEffect(() => {
    if (
      step !== 3 ||
      !registrationId ||
      !paymentStatus ||
      !["pending_payment", "expired"].includes(paymentStatus)
    )
      return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let count = 0;
    const delays = [1500, 2500, 4000, 6000, 8000, 10000, 10000];
    const poll = async () => {
      if (cancelled) return;
      try {
        const result = await checkStatus();
        if (result && !["pending_payment", "expired"].includes(result.status))
          return;
      } catch {
        /* Manual status checks remain available. */
      }
      if (++count < delays.length && !cancelled)
        timer = setTimeout(poll, delays[count]);
    };
    timer = setTimeout(poll, delays[0]);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [step, registrationId, paymentStatus, checkStatus]);
  function ensureSession() {
    if (!session.current) {
      session.current = {
        key: crypto.randomUUID(),
        checkoutStarted: false,
        token: Array.from(crypto.getRandomValues(new Uint8Array(32)), (n) =>
          n.toString(16).padStart(2, "0"),
        ).join(""),
      };
      saveSession(session.current);
    }
    return session.current;
  }
  function update(field: keyof StudentDetails, value: string) {
    setStudent((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (field === "email") {
      setVerifiedEmail("");
      setVerification(null);
      setCode("");
      setCodeError("");
    }
  }
  function continueDetails() {
    const found = validateStudent(student);
    const detailsErrors: FieldErrors = {};
    for (const field of ["name", "email", "phone", "gender"] as const) {
      if (found[field]) detailsErrors[field] = found[field];
    }
    setErrors(detailsErrors);
    setMessage("");
    if (Object.keys(detailsErrors).length) {
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setStep(1);
  }
  async function sendCode() {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setMessage("");
    setCodeError("");
    ensureSession();
    try {
      setVerification(
        await request<EmailVerification>("/api/email/request", {
          student: normalizeStudent(student),
        }),
      );
      setCode("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Your code could not be sent. Please try again shortly.",
      );
    } finally {
      setBusy(false);
      inFlight.current = false;
    }
  }
  async function review() {
    const found = validateStudent(student);
    setErrors(found);
    setMessage("");
    if (Object.keys(found).length) {
      setStep(
        ["name", "email", "phone", "gender"].some(
          (field) => found[field as keyof StudentDetails],
        )
          ? 0
          : 1,
      );
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setStudent(normalizeStudent(student));
    if (
      verifiedEmail === normalizeStudent(student).email &&
      verification?.verified
    ) {
      setStep(2);
      return;
    }
    setStep(2);
    if (catalogue?.emailReady) await sendCode();
  }
  async function confirmCode() {
    if (!verification || busy || inFlight.current) return;
    if (!/^\d{6}$/.test(code)) {
      setCodeError("Enter the six-digit code from your email.");
      return;
    }
    inFlight.current = true;
    setBusy(true);
    setMessage("");
    setCodeError("");
    try {
      await request("/api/email/verify", {
        verificationId: verification.verificationId,
        code,
      });
      setVerifiedEmail(normalizeStudent(student).email);
      setVerification((current) =>
        current ? { ...current, verified: true } : current,
      );
      setStep(2);
    } catch (error) {
      setCodeError(
        error instanceof Error
          ? error.message
          : "The code could not be verified. Please try again.",
      );
    } finally {
      setBusy(false);
      inFlight.current = false;
    }
  }
  const selectedStack = catalogue?.stacks.find(
    (stack) => stack.id === student.stackId,
  );
  const amount = selectedStack?.amount ?? registrationPrice;
  const canPay =
    !!catalogue?.salesOpen &&
    !!selectedStack?.available &&
    scriptReady &&
    verifiedEmail === normalizeStudent(student).email &&
    !!verification?.verified;
  async function verifyPayment(result: RazorpayResult) {
    setBusy(true);
    setMessage("Verifying your payment…");
    try {
      setCheckout(
        await request<Checkout>("/api/payments/verify", {
          registrationId: session.current?.registrationId,
          ...result,
        }),
      );
      setMessage("");
    } catch {
      setMessage(
        "We’re still checking your payment. If money was debited, check the status before paying again.",
      );
    } finally {
      setBusy(false);
    }
  }
  function openCheckout(value: Checkout) {
    if (value.paymentMode !== catalogue?.paymentMode || !value.keyId) {
      setMessage(
        "This checkout used a different Razorpay mode. Start a new registration.",
      );
      return;
    }
    if (!window.Razorpay || !value.orderId) {
      setMessage("Checkout is not ready. Check your status again shortly.");
      return;
    }
    if (value.expiresAt <= Date.now() / 1000) {
      setMessage(
        "Your seat hold has expired. Check your payment status before starting again.",
      );
      return;
    }
    // Public checkout options come from the Worker-created order. Only the Worker can confirm payment.
    const modal = new window.Razorpay({
      key: value.keyId,
      amount: value.amount,
      currency: value.currency,
      name: "Exodia 4.0",
      description: "Student registration · one learning stack",
      order_id: value.orderId,
      prefill: {
        name: student.name,
        email: student.email,
        contact: normalizeStudent(student).phone,
      },
      theme: { color: "#48343f" },
      modal: {
        ondismiss: () => {
          setBusy(false);
          setMessage(
            "Checkout closed. Resume the same payment while your seat is held, or check your status.",
          );
          void checkStatus().catch(() => {});
        },
      },
      handler: (result) => {
        void verifyPayment(result);
      },
    });
    modal.on("payment.failed", () =>
      setMessage(
        "That attempt did not complete. You can retry in checkout. If money was debited, check your status first.",
      ),
    );
    modal.open();
  }
  async function pay() {
    if (!canPay || inFlight.current) return false;
    inFlight.current = true;
    setBusy(true);
    setMessage("");
    const active = ensureSession();
    // Persist before sending: a lost response must not allow a second order.
    active.checkoutStarted = true;
    saveSession(active);
    try {
      const result = await request<Checkout>("/api/checkout", {
        student,
        expectedAmount: amount,
        idempotencyKey: active.key,
        verificationId: verification?.verificationId,
      });
      active.registrationId = result.registrationId;
      saveSession(active);
      setCheckout(result);
      setStep(3);
      if (result.status === "pending_payment") openCheckout(result);
      return true;
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The connection was interrupted. Check your status before paying again.",
      );
      if (
        error instanceof RequestError &&
        [400, 409, 415].includes(error.status)
      ) {
        if (error.fields) {
          setErrors(error.fields);
          setStep(
            ["name", "email", "phone", "gender"].some(
              (field) => error.fields?.[field as keyof StudentDetails],
            )
              ? 0
              : 1,
          );
          requestAnimationFrame(() => errorRef.current?.focus());
        }
        void loadCatalogue();
      } else if (error instanceof RequestError && error.status === 403) {
        setVerifiedEmail("");
        setVerification(null);
        setCodeError("Your email verification expired. Request a new code.");
        setStep(2);
      } else {
        setStep(3);
        try {
          await checkStatus();
        } catch {
          /* Keep the same checkout context. */
        }
      }
      return false;
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  async function refreshStatus() {
    setBusy(true);
    setMessage("");
    try {
      await Promise.all([loadCatalogue(), checkStatus()]);
    } catch {
      setMessage(
        "We couldn’t retrieve your status. Try again shortly, or contact the event team before making another payment.",
      );
    } finally {
      setBusy(false);
    }
  }
  function restart() {
    saveSession(null);
    session.current = null;
    setCheckout(null);
    setVerification(null);
    setVerifiedEmail("");
    setCode("");
    setCodeError("");
    setStudent(emptyStudent);
    setStep(0);
    setErrors({});
    setMessage("");
    void loadCatalogue();
  }
  return {
    student,
    step,
    setStep,
    errors,
    message,
    catalogue,
    catalogueLoading,
    checkout,
    verification,
    code,
    setCode,
    codeError,
    setCodeError,
    emailVerified:
      verifiedEmail === normalizeStudent(student).email &&
      !!verification?.verified,
    busy,
    scriptReady,
    setScriptReady,
    scriptFailed,
    setScriptFailed,
    clockTime,
    headingRef,
    errorRef,
    amount,
    canPay,
    update,
    continueDetails,
    review,
    sendCode,
    confirmCode,
    pay,
    refreshStatus,
    restart,
    openCheckout,
  };
}
