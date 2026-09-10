"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowUpRight,
  Copy,
  MessageCircle,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { indicatorProduct, membershipProduct } from "@/config/products";
import { RISK_POLICY_VERSION, riskPolicySections } from "@/config/risk-policy";
import { getPublicApiUrl } from "@/lib/api";
import {
  checkoutSchema,
  detailsFields,
  type CheckoutValues,
} from "@/lib/validation/checkout";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "./checkout-flow.module.css";

type ProductKind = "membership" | "indicator";
type CheckoutSession = {
  agreement_id: string;
  order_id: string;
  payment_id: string;
  order_reference: string;
  access_token: string;
  amount: number;
  currency: string;
};

const apiUrl = getPublicApiUrl();
const upiId = "linubabu210905@okicici";
const upiUrl = "upi://pay?pa=linubabu210905%40okicici&pn=LINU&cu=INR";

async function fileToBase64(file?: File) {
  if (!file) return null;
  if (file.size > 2_000_000)
    throw new Error("Screenshot must be smaller than 2 MB");
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("Could not read screenshot"));
    reader.readAsDataURL(file);
  });
}

export function CheckoutFlow({
  productKind,
  qrAsset,
}: {
  productKind: ProductKind;
  qrAsset: string;
}) {
  const product =
    productKind === "indicator" ? indicatorProduct : membershipProduct;
  const [step, setStep] = useState(1);
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [screenshot, setScreenshot] = useState<File>();
  const [qrFailed, setQrFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      country: "",
      whatsappNumber: "",
      readRisk: false,
      noGuarantee: false,
      agreeTerms: false,
      typedName: "",
    },
  });
  const values = useWatch({ control: form.control });
  const consentReady =
    values.readRisk &&
    values.noGuarantee &&
    values.agreeTerms &&
    (values.typedName ?? "").trim().toLocaleLowerCase() ===
      (values.fullName ?? "").trim().toLocaleLowerCase();
  const progressLabel = useMemo(
    () => ["DETAILS", "RISK & TERMS", "PAYMENT", "CONFIRMATION"][step - 1],
    [step],
  );
  const whatsappPaymentUrl = getWhatsAppUrl(
    session
      ? `Hi MARCOS, I completed the payment for ${product.name}. Order: ${session.order_reference}. Payment reference: ${paymentReference || "I will attach the receipt"}. Please verify it and confirm my access.`
      : `Hi MARCOS, I'd like to confirm the exact INR amount for ${product.name} before using UPI.`,
  );

  const copyUpiId = async () => {
    await navigator.clipboard.writeText(upiId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const continueDetails = async () => {
    const valid = await form.trigger(detailsFields);
    if (valid) {
      setRequestError(null);
      setStep(2);
    }
  };

  const acceptAgreement = async () => {
    const valid = await form.trigger([
      "readRisk",
      "noGuarantee",
      "agreeTerms",
      "typedName",
    ]);
    if (!valid || !consentReady) return;
    if (!apiUrl) {
      setRequestError(
        "Secure checkout is not connected yet. Contact MARCOS on WhatsApp.",
      );
      return;
    }
    setSubmitting(true);
    setRequestError(null);
    try {
      const response = await fetch(`${apiUrl}/api/v1/checkout/agreements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_slug: product.slug,
          full_name: values.fullName,
          email: values.email,
          mobile: values.mobile,
          country: values.country,
          whatsapp_number: values.whatsappNumber || null,
          typed_name: values.typedName,
          consent: {
            read_risk: values.readRisk,
            no_guarantee: values.noGuarantee,
            agree_terms: values.agreeTerms,
          },
        }),
      });
      if (!response.ok)
        throw new Error(
          (await response.json().catch(() => null))?.detail ??
            "Agreement could not be created",
        );
      setSession((await response.json()) as CheckoutSession);
      setStep(3);
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : "Checkout service unavailable",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const submitPayment = async () => {
    if (!session || paymentReference.trim().length < 4) {
      setRequestError("Enter your payment reference");
      return;
    }
    if (!apiUrl) {
      setRequestError(
        "Secure checkout is not connected yet. Contact MARCOS on WhatsApp.",
      );
      return;
    }
    setSubmitting(true);
    setRequestError(null);
    try {
      const screenshotBase64 = await fileToBase64(screenshot);
      const response = await fetch(
        `${apiUrl}/api/v1/payments/${session.payment_id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Order-Token": session.access_token,
          },
          body: JSON.stringify({
            reference_number: paymentReference.trim(),
            screenshot_base64: screenshotBase64,
            screenshot_content_type: screenshot?.type ?? null,
          }),
        },
      );
      if (!response.ok)
        throw new Error(
          (await response.json().catch(() => null))?.detail ??
            "Payment reference could not be submitted",
        );
      setStep(4);
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : "Payment service unavailable",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.summary}>
        <p className={styles.eyebrow}>MARCOS / SECURE CHECKOUT</p>
        <h1>{product.name}</h1>
        <p>
          A deliberate checkout: identity, explicit risk acceptance, then manual
          payment verification.
        </p>
        <div className={styles.price}>
          <del>${product.originalPrice}</del>
          <strong>${product.offerPrice}</strong>
          <span>{product.currency}</span>
        </div>
        <p className={styles.policy}>
          POLICY {RISK_POLICY_VERSION} / LEGAL_REVIEW_REQUIRED
        </p>
      </aside>
      <section className={styles.flow} aria-labelledby="checkout-step-title">
        <ol className={styles.progress}>
          {["DETAILS", "RISK", "PAYMENT", "CONFIRM"].map((label, index) => (
            <li
              key={label}
              data-active={index + 1 === step}
              data-done={index + 1 < step}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
            </li>
          ))}
        </ol>
        <p className={styles.stepLabel}>
          STEP {String(step).padStart(2, "0")} / {progressLabel}
        </p>
        {step === 1 && (
          <div className={styles.panel}>
            <h2 id="checkout-step-title">
              TELL US WHO IS ACCEPTING THE AGREEMENT.
            </h2>
            <p>
              Only the details needed to record your order and risk
              acknowledgement.
            </p>
            <div className={styles.fields}>
              <Field
                label="Full legal name"
                error={form.formState.errors.fullName?.message}
              >
                <input autoComplete="name" {...form.register("fullName")} />
              </Field>
              <Field
                label="Email address"
                error={form.formState.errors.email?.message}
              >
                <input
                  type="email"
                  autoComplete="email"
                  {...form.register("email")}
                />
              </Field>
              <Field
                label="Mobile number"
                error={form.formState.errors.mobile?.message}
              >
                <input
                  type="tel"
                  autoComplete="tel"
                  {...form.register("mobile")}
                />
              </Field>
              <Field
                label="Country"
                error={form.formState.errors.country?.message}
              >
                <input
                  autoComplete="country-name"
                  {...form.register("country")}
                />
              </Field>
              <Field
                label="WhatsApp number (optional, if different)"
                error={form.formState.errors.whatsappNumber?.message}
                wide
              >
                <input type="tel" {...form.register("whatsappNumber")} />
              </Field>
            </div>
            <button
              className={styles.primary}
              type="button"
              onClick={continueDetails}
            >
              CONTINUE TO RISK & TERMS <ArrowUpRight size={17} aria-hidden />
            </button>
          </div>
        )}
        {step === 2 && (
          <div className={styles.panel}>
            <button
              className={styles.back}
              type="button"
              onClick={() => setStep(1)}
            >
              <ArrowLeft size={15} /> DETAILS
            </button>
            <h2 id="checkout-step-title">IMPORTANT RISK ACKNOWLEDGEMENT</h2>
            <p>
              Read this before payment. MARCOS is education and community; it
              does not guarantee outcomes.
            </p>
            <div className={styles.riskText}>
              {riskPolicySections.map((section, index) => (
                <article key={section.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{section.title}</h3>
                    <p>{section.body}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className={styles.consents}>
              <CheckField error={form.formState.errors.readRisk?.message}>
                <input type="checkbox" {...form.register("readRisk")} />I have
                read and understand the Risk Acknowledgement.
              </CheckField>
              <CheckField error={form.formState.errors.noGuarantee?.message}>
                <input type="checkbox" {...form.register("noGuarantee")} />I
                understand that MARCOS does not guarantee trading profits,
                funding or evaluation success.
              </CheckField>
              <CheckField error={form.formState.errors.agreeTerms?.message}>
                <input type="checkbox" {...form.register("agreeTerms")} />I
                agree to the Terms of Service and Risk Disclosure.
              </CheckField>
              <Field
                label="Type your full legal name"
                error={
                  values.typedName && !consentReady
                    ? "Name must exactly match the details step"
                    : form.formState.errors.typedName?.message
                }
                wide
              >
                <input autoComplete="off" {...form.register("typedName")} />
              </Field>
            </div>
            <button
              className={styles.primary}
              type="button"
              disabled={!consentReady || submitting}
              onClick={acceptAgreement}
            >
              {submitting ? "CREATING AGREEMENT..." : "ACCEPT & CONTINUE"}{" "}
              <ArrowUpRight size={17} />
            </button>
          </div>
        )}
        {step === 3 && session && (
          <div className={styles.panel}>
            <button
              className={styles.back}
              type="button"
              onClick={() => setStep(2)}
            >
              <ArrowLeft size={15} /> RISK & TERMS
            </button>
            <p className={styles.eyebrow}>UPI / MANUAL VERIFICATION</p>
            <h2 id="checkout-step-title">PAY. THEN SEND THE RECEIPT.</h2>
            <div className={styles.paymentDue}>
              <span>PRICE REFERENCE</span>
              <strong>${session.amount}</strong>
              <small>{session.currency}</small>
            </div>
            <div className={styles.paymentNotice}>
              <ShieldCheck size={20} strokeWidth={1.5} aria-hidden />
              <p>
                UPI settles in INR. Confirm the exact INR amount with MARCOS
                before transferring. Scanning the QR never activates access
                automatically.
              </p>
            </div>
            <div className={styles.paymentGrid}>
              <div className={styles.qr}>
                {!qrFailed ? (
                  <Image
                    src={qrAsset}
                    alt="UPI payment QR code for MARCOS membership"
                    width={532}
                    height={522}
                    unoptimized
                    onError={() => setQrFailed(true)}
                  />
                ) : (
                  <div>
                    <span>PAYMENT QR</span>
                    <strong>QR UNAVAILABLE</strong>
                    <p>Use the UPI ID or contact MARCOS on WhatsApp.</p>
                  </div>
                )}
              </div>
              <div className={styles.paymentDetails}>
                <span>PAYMENT DESTINATION</span>
                <h3>LINU</h3>
                <dl>
                  <div>
                    <dt>UPI ID</dt>
                    <dd>{upiId}</dd>
                  </div>
                  <div>
                    <dt>ORDER</dt>
                    <dd>{session.order_reference}</dd>
                  </div>
                </dl>
                <button type="button" onClick={copyUpiId}>
                  <Copy size={15} aria-hidden />
                  {copied ? "UPI ID COPIED" : "COPY UPI ID"}
                </button>
                <a href={upiUrl}>
                  <Smartphone size={16} aria-hidden />
                  OPEN A UPI APP
                </a>
                <a href={whatsappPaymentUrl} target="_blank" rel="noreferrer">
                  <MessageCircle size={16} aria-hidden />
                  CONFIRM INR AMOUNT
                </a>
              </div>
            </div>
            <div className={styles.paymentInstructions}>
              <span>01</span>
              <p>
                Confirm the exact INR amount, then pay using the QR or UPI ID.
              </p>
              <span>02</span>
              <p>Enter the UTR / transaction reference below.</p>
              <span>03</span>
              <p>Send your receipt on WhatsApp for manual verification.</p>
            </div>
            <p className={styles.paymentDisclaimer}>
              Payment submission only starts review. It is not proof of success
              and does not activate membership.
            </p>
            <Field label="Payment reference" wide>
              <input
                inputMode="text"
                autoComplete="off"
                placeholder="UTR / transaction reference"
                value={paymentReference}
                onChange={(event) => setPaymentReference(event.target.value)}
              />
            </Field>
            <Field label="Payment screenshot (optional, max 2 MB)" wide>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => setScreenshot(event.target.files?.[0])}
              />
            </Field>
            <button
              className={styles.primary}
              type="button"
              disabled={submitting || paymentReference.trim().length < 4}
              onClick={submitPayment}
            >
              {submitting ? "SUBMITTING..." : "I'VE COMPLETED PAYMENT"}{" "}
              <ArrowUpRight size={17} />
            </button>
          </div>
        )}
        {step === 4 && session && (
          <div className={`${styles.panel} ${styles.confirmation}`}>
            <ShieldCheck size={42} strokeWidth={1.3} />
            <p className={styles.eyebrow}>
              PAYMENT SUBMITTED / PENDING VERIFICATION
            </p>
            <h2 id="checkout-step-title">WE&apos;RE VERIFYING YOUR PAYMENT.</h2>
            <p>
              Your access will activate only after manual confirmation. Pressing
              the payment button did not mark this order as paid.
            </p>
            <div>
              <span>REFERENCE</span>
              <strong>{session.order_reference}</strong>
            </div>
            <a
              className={styles.whatsappAction}
              href={whatsappPaymentUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} aria-hidden />
              SEND RECEIPT ON WHATSAPP
              <ArrowUpRight size={16} aria-hidden />
            </a>
            <p className={styles.verificationNote}>
              Include your order reference and payment screenshot. MARCOS will
              confirm access only after matching the payment independently.
            </p>
          </div>
        )}
        {requestError && (
          <p className={styles.error} role="alert">
            {requestError}
          </p>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  error,
  wide,
  children,
}: {
  label: string;
  error?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={wide ? styles.wide : undefined}>
      <span>{label}</span>
      {children}
      {error && <small className={styles.fieldError}>{error}</small>}
    </label>
  );
}
function CheckField({
  error,
  children,
}: {
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={styles.check}>
      {children}
      {error && <small className={styles.fieldError}>{error}</small>}
    </label>
  );
}
