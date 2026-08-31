import Link from "next/link";

/** Shared 404 body — copy carried over from the storefront's error page. */
export default function NotFoundContent() {
  return (
    <section className="oops-section section-padding white-bg fix">
      <div className="container text-center">
        <h1
          className="theme-clr fw-bold lh-1 mb-3"
          style={{ fontSize: "clamp(96px, 18vw, 160px)", letterSpacing: "-0.04em" }}
        >
          404
        </h1>
        <h2 className="text-black fs-32 fw-bold mb-3">Page Not Found</h2>
        <p className="fs-16 text-clr mb-4 max-w-520 mx-auto">
          This page isn’t on the menu. Head home for fresh food pickup, or browse everyday
          essentials for DoorDash delivery.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link href="/" className="theme-btn rounded-1 text-uppercase fs-13">
            Back to Home
          </Link>
          <Link
            href="/food"
            className="theme-btn rounded-1 theme-opacity-10 text-uppercase fs-13"
          >
            <span className="theme-clr">Fresh Food Menu</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
