/**
 * Single source of truth for storefront chrome details.
 *
 * Address confirmed by the client 2026-08-28. Phone taken from the store's own
 * Facebook and Instagram posts on 2026-09-01, which list (215) 595-2136 — the
 * previous (215) 718-7553 appears nowhere in the store's public listings.
 */
export const siteConfig = {
  name: "Crimson Deli",
  street: "7720 Ogontz Avenue",
  cityStateZip: "Philadelphia, PA 19150",
  get address() {
    return `${this.street}, ${this.cityStateZip}`;
  },
  phone: "(215) 595-2136",
  phoneHref: "tel:+12155952136",
  email: "info@crimsondeli.com",
  doordashUrl:
    "https://www.doordash.com/convenience/store/crimson-deli-inc.-philadelphia-28047799/",
  /**
   * Social profiles. Blank means "no account yet" — the footer skips those
   * rather than rendering an icon that links nowhere. Fill one in and it
   * appears automatically.
   */
  social: {
    facebook: "https://www.facebook.com/CrimsonDeli/",
    // No X account yet — a blank URL renders no icon.
    x: "",
    instagram: "https://www.instagram.com/crimsondeli.1/",
    pinterest: "https://www.pinterest.com/crimsondeli1/",
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
