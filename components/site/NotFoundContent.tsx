import Link from "next/link";

/** Shared 404 body — Crimson brand styling. */
export default function NotFoundContent() {
  return (
    <section className="cd-section cd-section--cream">
      <div className="cd-page-wrap cd-empty">
        <p className="cd-not-found__code" aria-hidden="true">
          404
        </p>
        <h1>Page not found</h1>
        <p>
          This page isn&apos;t on the menu. Head home for fresh food pickup, or browse
          everyday essentials for DoorDash delivery.
        </p>
        <div className="cd-not-found__actions">
          <Link href="/" className="cd-btn-solid">
            Back to home
          </Link>
          <Link href="/food" className="cd-btn-solid cd-btn-solid--ghost">
            Fresh food menu
          </Link>
        </div>
      </div>
    </section>
  );
}
