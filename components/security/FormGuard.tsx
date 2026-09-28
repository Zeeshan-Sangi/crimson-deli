"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Client half of `lib/security/form-guard.ts`: the hidden honeypot field, the
 * time the form has been open, and the reCAPTCHA v2 checkbox.
 *
 *   const guard = useFormGuard();
 *   ...
 *   if (!guard.ready()) return setError(guard.captchaPrompt);
 *   fetch(url, { body: JSON.stringify({ ...fields, ...guard.payload() }) });
 *   ...on any failure: guard.reset();
 *   ...in the form: {guard.fields}
 *
 * With no NEXT_PUBLIC_RECAPTCHA_SITE_KEY the checkbox is not shown and the
 * honeypot and timing checks still run.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";
const SCRIPT_ID = "cd-recaptcha-script";
const ONLOAD = "__cdRecaptchaLoaded";

type Grecaptcha = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      size?: "normal" | "compact";
    },
  ) => number;
  reset: (id?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
    [ONLOAD]?: () => void;
  }
}

let loader: Promise<Grecaptcha> | null = null;

function loadRecaptcha(): Promise<Grecaptcha> {
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    if (window.grecaptcha?.render) return resolve(window.grecaptcha);
    window[ONLOAD] = () => resolve(window.grecaptcha!);
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = `https://www.google.com/recaptcha/api.js?render=explicit&onload=${ONLOAD}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => {
      loader = null;
      reject(new Error("reCAPTCHA failed to load"));
    };
    document.head.appendChild(s);
  });
  return loader;
}

export const recaptchaEnabled = SITE_KEY !== "";

export function useFormGuard() {
  const [openedAt] = useState(() => Date.now());
  const [trap, setTrap] = useState("");
  const [token, setToken] = useState("");
  const [loadError, setLoadError] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);

  useEffect(() => {
    if (!recaptchaEnabled) return;
    let cancelled = false;
    loadRecaptcha()
      .then((g) => {
        if (cancelled || !box.current || widgetId.current !== null) return;
        // Compact fits phones narrower than the 304px standard widget.
        const compact = box.current.offsetWidth > 0 && box.current.offsetWidth < 304;
        widgetId.current = g.render(box.current, {
          sitekey: SITE_KEY,
          size: compact ? "compact" : "normal",
          callback: (t) => setToken(t),
          "expired-callback": () => setToken(""),
          "error-callback": () => setToken(""),
        });
      })
      .catch(() => !cancelled && setLoadError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const reset = useCallback(() => {
    setToken("");
    if (widgetId.current !== null) window.grecaptcha?.reset(widgetId.current);
  }, []);

  const payload = useCallback(
    () => ({ website: trap, elapsedMs: Date.now() - openedAt, recaptchaToken: token }),
    [trap, openedAt, token],
  );

  const fields = (
    <>
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}
      >
        <label>
          Leave this empty
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
          />
        </label>
      </div>
      {recaptchaEnabled && (
        <div className="cd-recaptcha">
          <div ref={box} />
          {loadError && (
            <p className="cd-form-error" role="alert">
              The &ldquo;I&rsquo;m not a robot&rdquo; check could not load. Please refresh the page.
            </p>
          )}
        </div>
      )}
    </>
  );

  return {
    fields,
    payload,
    reset,
    /** False while the checkbox still needs ticking. */
    ready: () => !recaptchaEnabled || token !== "",
    captchaPrompt: "Please tick the “I'm not a robot” box.",
  };
}
