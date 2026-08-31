/** Shared brand marks — same drawn language as the sign-in pages. */

export function Zig({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 34" fill="none" aria-hidden="true">
      <path
        d="M15 1 4 15h7L9 33 20 17h-7l2-16Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FoodLineArt({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 900"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M60 120c40-34 96-34 136 0 22 19 30 48 22 76l-28 96c-8 28-34 46-63 42-29-4-50-28-50-57V190c0-27 6-52 -17-70Z" />
        <path d="M92 168c26-18 60-18 86 0M96 232c26-18 60-18 86 0M100 296c26-18 60-18 86 0" />
        <path d="M352 262h180c0 50-40 90-90 90s-90-40-90-90Z" />
        <path d="M372 262c8-26 34-44 70-44s62 18 70 44" />
        <path d="M336 366h212" />
        <path d="M96 560c58-34 132-34 190 0 32 19 44 60 26 92-18 32-60 42-92 24l-118-68c-24-14-30-34-6-48Z" />
        <path d="M140 588l24 26M180 604l24 26M220 620l24 26" />
        <path d="M406 520c56-6 100 34 100 88-56 6-100-34-100-88Z" />
        <path d="M406 520c-6 56 34 100 88 100" />
        <path d="M372 690h150l-16 128c-3 24-24 42-48 42h-22c-24 0-45-18-48-42l-16-128Z" />
        <path d="M522 724h26c20 0 34 16 32 36-2 20-18 32-38 32h-14" />
      </g>
    </svg>
  );
}
