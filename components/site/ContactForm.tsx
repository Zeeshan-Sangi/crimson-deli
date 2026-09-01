"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { ArrowRight } from "lucide-react";

type Fields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const EMPTY: Fields = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  function validate(): boolean {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!fields.name.trim()) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!fields.message.trim()) next.message = "Please write a message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setBusy(true);
    setSendError(null);
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
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSendError(data.error ?? "Could not send your message.");
        return;
      }
      setFields(EMPTY);
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
          error={errors.name}
          autoComplete="name"
        />
        <Field
          id="contact-email"
          label="Your email"
          type="email"
          value={fields.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
        />
        <Field
          id="contact-phone"
          label="Phone (optional)"
          type="tel"
          value={fields.phone}
          onChange={set("phone")}
          autoComplete="tel"
        />
        <Field
          id="contact-subject"
          label="Subject (optional)"
          value={fields.subject}
          onChange={set("subject")}
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
            aria-invalid={!!errors.message}
          />
          {errors.message && <p className="cd-form-error">{errors.message}</p>}
        </div>
      </div>

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
          Thanks — we have your message and will get back to you. If it&rsquo;s urgent,
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
  error,
  type = "text",
  autoComplete,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
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
        autoComplete={autoComplete}
        aria-invalid={!!error}
      />
      {error && <p className="cd-form-error">{error}</p>}
    </div>
  );
}
