import type { Metadata } from "next";
import TemplateScripts from "@/components/template-scripts";

// Imported (not <link>ed) so Next bundles, minifies and fingerprints them.
// Order matters: the template's main.css overrides the vendor sheets above it.
import "@/styles/bootstrap.min.css";
import "@/styles/all.min.css";
import "@/styles/animate.css";
import "@/styles/meanmenu.css";
import "@/styles/nice-select.css";
import "@/styles/main.css";

export const metadata: Metadata = {
  title: "Crimson Deli",
  description:
    "Crimson Deli — Philadelphia restaurant, fast food, groceries and more.",
  icons: { icon: "/assets/img/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Extensions (e.g. LanguageTool) + template jQuery mutate the DOM after SSR */}
      <body suppressHydrationWarning>
        {children}
        <TemplateScripts />
      </body>
    </html>
  );
}
