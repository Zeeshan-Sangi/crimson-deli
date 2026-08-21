import type { NavItem } from "./navigation";

export const OPENING_HOURS = [
  { label: "Hours:", value: "9.30am – 6.30pm" },
  { label: null, value: "Monday to Friday" },
  { label: "Sunday:", value: "Closed" },
];

export const SOCIAL_LINKS = [
  { label: "Facebook", icon: "fab fa-facebook-f", href: "#" },
  { label: "Twitter", icon: "fab fa-twitter", href: "#" },
  { label: "Instagram", icon: "fa-brands fa-instagram", href: "#" },
];

export const INFORMATION_LINKS: NavItem[] = [
  { label: "Privacy Policy", href: "/contact" },
  { label: "Refund Policy", href: "/contact" },
  { label: "Shipping & Return", href: "/contact" },
  { label: "Terms of use", href: "/contact" },
  { label: "Discount Offer", href: "/shop" },
  { label: "Best Seller", href: "/shop" },
];

export const QUICK_LINKS: NavItem[] = [
  { label: "About Us", href: "/about" },
  { label: "Our Menu", href: "/menu" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/contact" },
  { label: "FAQ’s", href: "/faq" },
];

export const COPYRIGHT = "Copyright © 2026 All Rights Reserved.";
