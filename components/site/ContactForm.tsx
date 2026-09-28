"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { ArrowRight } from "lucide-react";
import { useFormGuard } from "@/components/security/FormGuard";
import { cleanPhoneInput, emailError, phoneError, requiredError } from "@/lib/forms/validate";

type Fields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const EMPTY: Fields = { name: "", email: "", phone: "", subject: "", message: "" };

/** Every field is required; each rule returns the message to show, if any. */
const RULES: Record<keyof Fields, (v: string) => string | undefined> = {
  name: (v) => requiredError(v, "Please tell us your name."),
  email: (v) => emailError(v),
  phone: (v) => phoneError(v),
  subject: (v) => requiredError(v, "Please add a subject."),
  message: (v) => requiredError(v, "Please write a message."),
};

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const guard = useFormGuard();

  // A field is checked when someone leaves it, and from then on as they type,
  // so the warning appears early and clears the moment the value is right.
  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = key === "phone" ? cleanPhoneInput(e.target.value) : e.target.value;
    setFields((f) => ({ ...f, [key]: value }));
    if (touched[key]) setErrors((prev) => ({ ...prev, [key]: RULES[key](value) }));
  };

  const blur = (key: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: RULES[key](fields[key]) }));
  };

  function validate(): boolean {
    const keys = Object.keys(RULES) as (keyof Fields)[];
    const next: Partial<Record<keyof Fields, string>> = {};
    for (const key of keys) next[key] = RULES[key](fields[key]);
    setErrors(next);
    setTouched(Object.fromEntries(keys.map((k) => [k, true])));
    return !Object.values(next).some(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSendError(null);
    if (!validate()) return;
    if (!guard.ready()) {
      setSendError(guard.captchaPrompt);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          phone: fields.phone,
          subject: fields.subject,
          body: fields.message,
          ...guard.payload(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        guard.reset();
        setSendError(data.error ?? "Could not send your message.");
        return;
      }
      guard.reset();
      setFields(EMPTY);
      setTouched({});
      setSent(true);
    } catch {
      setSendError("Could not reach the server. Please call the store instead.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="cd-form cd-contact-form" onSubmit={handleSubmit} noValidate>
      <div className="cd-form-grid cd-form-grid--2">
        <Field
          id="contact-name"
          label="Your name"
          value={fields.name}
          onChange={set("name")}
          onBlur={blur("name")}
          error={errors.name}
          autoComplete="name"
        />
        <Field
          id="contact-email"
          label="Your email"
          type="email"
          value={fields.email}
          onChange={set("email")}
          onBlur={blur("email")}
          error={errors.email}
          autoComplete="email"
        />
        <Field
          id="contact-phone"
          label="Phone number"
          type="tel"
          value={fields.phone}
          onChange={set("phone")}
          onBlur={blur("phone")}
          error={errors.phone}
          autoComplete="tel"
          inputMode="numeric"
        />
        <Field
          id="contact-subject"
          label="Subject"
          value={fields.subject}
          onChange={set("subject")}
          onBlur={blur("subject")}
          error={errors.subject}
        />

        <div className="cd-form-field" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="contact-message" className="visually-hidden">Message</label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            placeholder="How can we help?"
            value={fields.message}
            onChange={set("message")}
            onBlur={blur("message")}
            aria-invalid={!!errors.message}
          />
          {errors.message && <p className="cd-form-error">{errors.message}</p>}
        </div>
      </div>

      {guard.fields}

      <button type="submit" className="cd-btn-solid cd-contact-form__submit" disabled={busy}>
        {busy ? "Sending…" : "Send message"} <ArrowRight size={16} aria-hidden="true" />
      </button>

      {sendError && (
        <p className="cd-form-error" role="alert">
          {sendError}
        </p>
      )}

      {sent && (
        <p className="cd-form-success" role="status">
          Thanks, we have your message and will get back to you. If it&rsquo;s urgent,
          call the store on <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>.
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  return (
    <div className="cd-form-field">
      <label htmlFor={id} className="visually-hidden">{label}</label>
      <input
        id={id}
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <p id={`${id}-error`} className="cd-form-error">{error}</p>}
    </div>
  );
}
