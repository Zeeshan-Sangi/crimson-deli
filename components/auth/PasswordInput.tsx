"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete: "current-password" | "new-password";
  required?: boolean;
  minLength?: number;
};

/**
 * Password field with a show/hide toggle.
 *
 * Shared by login and signup so the two forms cannot drift apart. The toggle is
 * a real button rather than a click handler on an icon, so it reaches keyboard
 * and screen-reader users; `aria-pressed` reports the current state.
 */
export default function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
  autoComplete,
  required,
  minLength,
}: Props) {
  const [shown, setShown] = useState(false);
  const id = useId();

  return (
    <div className="auth-password">
      <input
        id={id}
        type={shown ? "text" : "password"}
        className="auth-input auth-input--password"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
      />

      <button
        type="button"
        className="auth-password__toggle"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
        aria-controls={id}
      >
        {shown ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
      </button>
    </div>
  );
}
