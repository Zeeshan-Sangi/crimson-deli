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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const subject = fields.subject.trim() || `Message from ${fields.name.trim()}`;
    const body = [
      `Name: ${fields.name.trim()}`,
      `Email: ${fields.email.trim()}`,
      fields.phone.trim() ? `Phone: ${fields.phone.trim()}` : null,
      "",
      fields.message.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form className="cd-form" onSubmit={handleSubmit} noValidate>
      <div className="cd-form-grid cd-form-grid--2">
        <Field label="Your name" id="contact-name" value={fields.name} onChange={set("name")} error={errors.name} autoComplete="name" />
        <Field label="Your email" id="contact-email" type="email" value={fields.email} onChange={set("email")} error={errors.email} autoComplete="email" />
        <Field label="Phone (optional)" id="contact-phone" type="tel" value={fields.phone} onChange={set("phone")} autoComplete="tel" />
        <Field label="Subject (optional)" id="contact-subject" value={fields.subject} onChange={set("subject")} />

        <div className="cd-form-field" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="contact-message">Message</label>
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

      <button type="submit" className="cd-btn-solid" style={{ marginTop: 16 }}>
        Send message <ArrowRight size={16} aria-hidden="true" />
      </button>

      {sent && (
        <p className="cd-form-success" role="status">
          Your mail app should have opened with the message ready to send. If it did not,
          email us directly at{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
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
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={!!error}
      />
      {error && <p className="cd-form-error">{error}</p>}
    </div>
  );
}
