import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { FoodLineArt, Zig } from "./BrandArt";
import "./auth.css";

/**
 * Shared frame for /login and /signup.
 *
 * Brand panel on the left carries the food photography and sweeps into the
 * cream form panel along an organic curve. Photos are Crimson Deli's own —
 * CLAUDE.md §10 rules out stock or invented imagery.
 */

const PHOTOS = [
  {
    src: "/assets/img/crimson/products/fruit-bowl.webp",
    alt: "Fresh fruit bowl made at Crimson Deli",
  },
  {
    src: "/assets/img/crimson/products/turkey-wrap.webp",
    alt: "Turkey wrap made at Crimson Deli",
  },
  {
    src: "/assets/img/crimson/products/deli-burger.webp",
    alt: "Hoagie made at Crimson Deli",
  },
] as const;

type AuthShellProps = {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AuthShell({ title, children, footer }: AuthShellProps) {
  return (
    <div className="auth-page">
      <div className="auth-layout">
        <aside className="auth-visual" aria-label="Crimson Deli fresh food">
          <FoodLineArt className="auth-visual__pattern" />

          <Link href="/" className="auth-visual__brand" aria-label={siteConfig.name}>
            <img
              src="/assets/img/logo/crimson-logo.webp"
              alt={siteConfig.name}
              width={1024}
              height={1024}
            />
          </Link>

          <Zig className="auth-visual__bolt auth-visual__bolt--1" />
          <Zig className="auth-visual__bolt auth-visual__bolt--2" />
          <Zig className="auth-visual__bolt auth-visual__bolt--3" />

          <div className="auth-visual__photo-rail">
            <span className="auth-visual__photo-shade" aria-hidden="true" />
            <div className="auth-visual__photos">
              {PHOTOS.map((photo) => (
                <img
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  width={208}
                  height={208}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          </div>

          <span className="auth-visual__cutout" aria-hidden="true" />
        </aside>

        <main className="auth-panel">
          {/* Same drawn language as the brand panel, at a whisper. Packshots
              were tried here first and read as pale blobs — they are studio
              shots on white, so there is no silhouette to fade. */}
          <FoodLineArt className="auth-panel__art" />
          <Zig className="auth-panel__bolt auth-panel__bolt--1" />
          <Zig className="auth-panel__bolt auth-panel__bolt--2" />

          <div className="auth-panel__inner">
            <h1 className="auth-panel__title">{title}</h1>
            {children}
            {footer}
          </div>
        </main>
      </div>
    </div>
  );
}
