import Link from "next/link";

const PER_PAGE = 12;

export function storePageUrl(page: number) {
  return page <= 1 ? "/store" : `/store?page=${page}`;
}

export function paginateProducts<T>(items: T[], page: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const end = Math.min(start + PER_PAGE, items.length);
  return {
    items: items.slice(start, end),
    page: safePage,
    totalPages,
    start,
    end,
    perPage: PER_PAGE,
  };
}

export default function StorePagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Catalog pages">
      <ul className="cd-pagination">
        {page > 1 && (
          <li>
            <Link href={storePageUrl(page - 1)} rel="prev">
              Previous
            </Link>
          </li>
        )}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            {n === page ? (
              <span aria-current="page">{n}</span>
            ) : (
              <Link href={storePageUrl(n)}>{n}</Link>
            )}
          </li>
        ))}
        {page < totalPages && (
          <li>
            <Link href={storePageUrl(page + 1)} rel="next">
              Next
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
