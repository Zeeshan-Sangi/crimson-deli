/**
 * Bootstrap vs Tailwind class-name collisions.
 *
 * Both frameworks define `.mb-5`, `.gap-3`, `.px-3` and friends. Bootstrap's
 * utilities carry `!important`, and `!important` reverses cascade-layer order,
 * so Bootstrap wins even though it sits in the lower `legacy` layer. Any
 * converted markup using a colliding name silently gets Bootstrap's value.
 *
 * Only names whose VALUES differ are reported: `mb-2` is 8px in both, so it is
 * harmless. Fix a hit by switching to an arbitrary value (`mb-[20px]`), which
 * Bootstrap never defines.
 *
 * IMPORTANT: a hit is only a bug in markup that has been CONVERTED to Tailwind.
 * Un-converted files still use these names as Bootstrap classes on purpose, and
 * Bootstrap's value is the one their design expects — do not "fix" those. Run
 * this on a file as you convert it:
 *
 *   node scripts/check-class-collisions.mjs "app/(site)/food/page.tsx"
 *
 * With no argument it scans everything, which is only useful as an inventory of
 * what will need attention when each file's turn comes.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BOOTSTRAP = "styles/crimson/bootstrap.min.css";
const ARGS = process.argv.slice(2);
const ROOTS = ARGS.length ? ARGS : ["app", "components"];

/** Tailwind's default spacing scale, in px. */
const TW_SPACE = { 0: 0, 0.5: 2, 1: 4, 1.5: 6, 2: 8, 2.5: 10, 3: 12, 3.5: 14, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 };
const SPACE_RE = /^(m|p)(b|t|l|r|s|e|x|y)?-(\d+(?:\.\d+)?)$/;
const GAP_RE = /^gap(-x|-y)?-(\d+(?:\.\d+)?)$/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".tsx")) out.push(p);
  }
  return out;
}

const css = readFileSync(BOOTSTRAP, "utf8");
/** Bootstrap's value for a class, when it is an !important utility. */
function bootstrapValue(cls) {
  const m = css.match(new RegExp(`\\.${cls.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`));
  if (!m || !m[1].includes("important")) return null;
  const rem = m[1].match(/(-?[\d.]+)rem/);
  if (rem) return Math.round(parseFloat(rem[1]) * 16);
  if (/:\s*0\s*!/.test(m[1])) return 0;
  return NaN; // non-spacing utility (colour, display…) — same visual result
}

function tailwindValue(cls) {
  let m = cls.match(SPACE_RE) || cls.match(GAP_RE);
  if (!m) return null;
  const n = m[m.length - 1];
  return TW_SPACE[n] ?? null;
}

const findings = [];
for (const root of ROOTS) {
  const files = statSync(root).isDirectory() ? walk(root) : [root];
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    const classes = new Set();
    for (const m of src.matchAll(/className=(?:"([^"]+)"|\{`([^`]+)`\})/g)) {
      for (const t of (m[1] ?? m[2] ?? "").split(/\s+/)) classes.add(t);
    }
    for (const cls of classes) {
      // Responsive/state prefixes cannot collide: the element's class token is
      // literally `xl:gap-4`, and Bootstrap's `.gap-4` selector does not match
      // that. Bootstrap spells its own breakpoints `.gap-xl-4`.
      if (cls.includes(":")) continue;
      const bare = cls;
      if (!/^[a-z]/.test(bare) || bare.includes("[")) continue;
      const bs = bootstrapValue(bare);
      const tw = tailwindValue(bare);
      if (bs === null || tw === null || Number.isNaN(bs)) continue;
      if (bs !== tw) findings.push({ file, cls, bs, tw });
    }
  }
}

if (findings.length === 0) {
  console.log("No value-changing collisions.");
} else {
  console.log(`${findings.length} collision(s) — Bootstrap wins via !important:\n`);
  const byFile = {};
  for (const f of findings) (byFile[f.file] ??= []).push(f);
  for (const [file, list] of Object.entries(byFile)) {
    console.log(`  ${file}`);
    for (const f of list) {
      console.log(`     ${f.cls.padEnd(18)} bootstrap ${String(f.bs).padStart(3)}px  vs  tailwind ${String(f.tw).padStart(3)}px  ->  use ${f.cls.replace(/-[\d.]+$/, `-[${f.tw}px]`)}`);
    }
  }
  process.exitCode = 1;
}
