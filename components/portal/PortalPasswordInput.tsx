"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Masked password field with a show/hide toggle, styled for the portal forms.
 *
 * The storefront has its own version (components/auth/PasswordInput); this one
 * inherits `.portal-form` styling instead of the auth panel's.
 */
export default function PortalPasswordInput({
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  autoComplete: "new-password" | "current-password";
  placeholder?: string;
}) {
  const [shown, setShown] = useState(false);

  return (
    <span className="portal-pw">
      <input
        type={shown ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        minLength={8}
      />
      <button
        type="button"
        className="portal-pw__toggle"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
      >
        {shown ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
      </button>
    </span>
  );
}
