/** A message sent from the storefront contact form. */
export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  body: string;
  /** Staff mark a message handled once they have replied or called back. */
  handledAt: string | null;
  createdAt: string;
};
