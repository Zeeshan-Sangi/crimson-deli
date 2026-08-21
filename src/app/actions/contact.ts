"use server";

export type ContactState = {
  ok: boolean;
  message: string;
  errors?: Partial<Record<"name" | "email" | "phone" | "subject" | "message", string>>;
};

export const EMPTY_CONTACT_STATE: ContactState = { ok: false, message: "" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim();
}

/** Replaces the template's contact.php POST target. */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = str(formData, "name");
  const email = str(formData, "email");
  const phone = str(formData, "phone");
  const subject = str(formData, "subject");
  const message = str(formData, "message");

  const errors: ContactState["errors"] = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL.test(email)) errors.email = "Please enter a valid email address.";
  if (message.length < 10) errors.message = "Please tell us a little more (10+ characters).";

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  // No email provider is wired up yet, so log the enquiry rather than silently
  // dropping it — and tell the visitor the truth instead of faking success.
  console.info("[contact] enquiry received", { name, email, phone, subject, message });

  return {
    ok: false,
    message:
      "Sorry — online enquiries aren't connected yet. Please call +1 (215) 718-7553 or email info@crimsondeli.com.",
  };
}
