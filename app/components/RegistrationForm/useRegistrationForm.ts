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
type Session = { token: string; key: string; registrationId?: string };
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
  const [busy, setBusy] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);
  const [clockTime, setClockTime] = useState(0);
  const session = useRef<Session | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
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
        .then(setCatalogue)
        .catch(() => setCatalogue(null))
        .finally(() => setCatalogueLoading(false)),
    [request],
  );
  useEffect(() => {
    void loadCatalogue();
    let cancelled = false;
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
        )
          return;
        if (session.current && !cancelled) {
          setStep(3);
          setMessage(
            "Your saved checkout could not be retrieved. Check its status before paying again.",
          );
        }
      }
    };
    void restore();
    return () => {
      cancelled = true;
    };
  }, [loadCatalogue, request]);
  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);
  useEffect(() => {
    if (step === 0) return;
    const timer = setInterval(() => setClockTime(Date.now() / 1000), 1000);
    return () => clearInterval(timer);
  }, [step]);
  const checkStatus = useCallback(async () => {
    const active = session.current;
    if (!active) return;
    const result = await request<Checkout>(
      "/api/registration-status?id=" +
        encodeURIComponent(active.registrationId ?? active.key),
    );
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
    }
  }
  async function sendCode() {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setMessage("");
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
    setStep(1);
    if (catalogue?.emailReady) await sendCode();
  }
  async function confirmCode() {
    if (!verification || busy || inFlight.current) return;
    if (!/^\d{6}$/.test(code)) {
      setMessage("Enter the six-digit code from your email.");
      return;
    }
    inFlight.current = true;
    setBusy(true);
    setMessage("");
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
      setMessage(
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
    if (!canPay || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setMessage("");
    const active = ensureSession();
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
          setStep(0);
        }
        void loadCatalogue();
      } else if (error instanceof RequestError && error.status === 403) {
        setVerifiedEmail("");
        setVerification(null);
        setStep(1);
      } else {
        setStep(3);
        try {
          await checkStatus();
        } catch {
          /* Keep the same checkout context. */
        }
      }
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  async function refreshStatus() {
    setBusy(true);
    setMessage("");
    try {
      await checkStatus();
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
    review,
    sendCode,
    confirmCode,
    pay,
    refreshStatus,
    restart,
    openCheckout,
  };
}
