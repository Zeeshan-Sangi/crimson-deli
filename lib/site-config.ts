/**
 * Single source of truth for storefront chrome details.
 *
 * Address and phone confirmed by the client 2026-08-28; CLAUDE.md and the
 * interim pages in `public/site/` were corrected to match.
 */
export const siteConfig = {
  name: "Crimson Deli",
  street: "7720 Ogontz Avenue",
  cityStateZip: "Philadelphia, PA 19150",
  get address() {
    return `${this.street}, ${this.cityStateZip}`;
  },
  phone: "(215) 718-7553",
  phoneHref: "tel:+12157187553",
  email: "info@crimsondeli.com",
  doordashUrl:
    "https://www.doordash.com/convenience/store/crimson-deli-inc.-philadelphia-28047799/",
  /**
   * Social profiles. Blank means "no account yet" — the footer skips those
   * rather than rendering an icon that links nowhere. Fill one in and it
   * appears automatically.
   */
  social: {
    facebook: "",
    x: "",
    instagram: "",
    pinterest: "",
  },
} as const;

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/food", label: "Fresh Food" },
  { href: "/store", label: "Everyday Essentials" },
  { href: "/cart", label: "Cart" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
