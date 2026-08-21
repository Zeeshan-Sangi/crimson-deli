"use client";

import { useActionState } from "react";
import {
  EMPTY_CONTACT_STATE,
  submitContact,
} from "@/app/actions/contact";

/** Template markup for the contact form, wired to a Server Action instead of contact.php. */
export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, EMPTY_CONTACT_STATE);
  const err = state.errors ?? {};

  return (
    <form action={action} id="contact-form" className="contact-form-box">
      <div className="row g-4 align-items-center justify-content-center">
        <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".2s">
          <div className="form-clt">
            <input type="text" name="name" placeholder="Name" aria-label="Name" />
            {err.name && <small className="text-danger">{err.name}</small>}
          </div>
        </div>
        <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s">
          <div className="form-clt">
            <input type="email" name="email" placeholder="Your email" aria-label="Your email" />
            {err.email && <small className="text-danger">{err.email}</small>}
          </div>
        </div>
        <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".4s">
          <div className="form-clt">
            <input type="tel" name="phone" placeholder="Phone number" aria-label="Phone number" />
          </div>
        </div>
        <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".5s">
          <div className="form-clt">
            <input type="text" name="subject" placeholder="Your subject" aria-label="Your subject" />
          </div>
        </div>
        <div className="col-lg-12 wow fadeInUp" data-wow-delay=".8s">
          <div className="form-clt">
            <textarea name="message" placeholder="Your message..." aria-label="Your message" />
            {err.message && <small className="text-danger">{err.message}</small>}
          </div>
        </div>
        <div className="col-lg-12 wow fadeInUp" data-wow-delay=".9s">
          <div className="contact-button">
            <button type="submit" className="theme-btn" disabled={pending}>
              {pending ? "Sending…" : "Submit Now"}
              <i className="far fa-arrow-right"></i>
            </button>
          </div>
          {state.message && (
            <p className={state.ok ? "text-success mt-3" : "text-danger mt-3"} role="status">
              {state.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
