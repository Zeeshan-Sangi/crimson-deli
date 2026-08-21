/**
 * Single source of truth for site navigation.
 *
 * Desktop, mobile, and offcanvas menus all render from this tree.
 */

export type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
  /** Wide multi-column dropdown (desktop). */
  mega?: boolean;
  groups?: { title: string; items: NavItem[] }[];
};

export const CATEGORIES: NavItem[] = [
  { label: "Burgers", href: "/shop" },
  { label: "Pizza", href: "/shop" },
  { label: "Fast Food", href: "/shop" },
  { label: "Hot Dogs", href: "/shop" },
];

/** Flatten mega groups so mobile nav can reuse the same tree. */
export function flattenNav(items: NavItem[]): NavItem[] {
  return items.map((item) => {
    if (item.mega && item.groups) {
      return {
        label: item.label,
        href: item.href,
        children: item.groups.flatMap((g) => g.items),
      };
    }
    if (item.children) {
      return { ...item, children: flattenNav(item.children) };
    }
    return item;
  });
}

export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  {
    label: "Shop",
    href: "/shop",
    mega: true,
    groups: [
      {
        title: "Shop",
        items: [
          { label: "All Products", href: "/shop" },
          { label: "Product Details", href: "/shop-details" },
        ],
      },
      {
        title: "Categories",
        items: CATEGORIES,
      },
      {
        title: "Orders",
        items: [
          { label: "Cart", href: "/shop-cart" },
          { label: "Checkout", href: "/checkout" },
        ],
      },
    ],
  },
  { label: "Reservation", href: "/reservation" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const TOP_BAR_NAV: NavItem[] = [
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Reservation", href: "/reservation" },
  { label: "Contact", href: "/contact" },
];

export const LOCATIONS = ["7720 Ogontz Avenue, Philadelphia, PA 19150"];

export const CONTACT = {
  phone: "+1 (215) 718-7553",
  phoneHref: "tel:+12157187553",
  email: "info@crimsondeli.com",
  address: "7720 Ogontz Avenue, Philadelphia, PA 19150",
};
