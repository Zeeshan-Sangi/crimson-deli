/**
 * Phase 3: make the template's main.js safe to re-run on client-side navigation.
 *
 * main.js does all of its work inside one `$(document).ready(...)` callback. With
 * full page reloads that ran once per page, which is why the template worked. Once
 * <Link> does client-side navigation the layout (and main.js) never remount, so the
 * new page's sliders/animations are never initialised.
 *
 * The fix is to expose that callback as window.__templateReady() and make it
 * idempotent, so app/template.tsx can call it again after every navigation:
 *
 *   1. expose the ready callback and record that it has run at least once
 *   2. clear namespaced global handlers up front so they cannot stack up
 *   3. namespace every document/window handler bound inside the callback
 *   4. guard the singletons that live in the persistent layout
 *      (ScrollSmoother, meanmenu, nice-select) so they initialise only once
 *   5. keep a single WOW instance and refresh ScrollTrigger after each run
 *
 * Reads public/assets/js/main.js (left untouched) and writes main.patched.js.
 * Usage: node scripts/patch-main-js.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "public/assets/js/main.js";
const OUT = "public/assets/js/main.patched.js";

let s = readFileSync(SRC, "utf8");
const edits = [];
const drops = [];

/** Remove `function name() { ... }` by brace matching, plus any calls to it. */
function dropFunction(name) {
  const at = s.indexOf(`function ${name}(`);
  if (at === -1) throw new Error(`function not found: ${name}`);
  let depth = 0;
  let k = s.indexOf("{", at);
  for (; k < s.length; k++) {
    if (s[k] === "{") depth += 1;
    else if (s[k] === "}") {
      depth -= 1;
      if (depth === 0) break;
    }
  }
  s = s.slice(0, at) + s.slice(k + 1);
  s = s.replace(new RegExp(`\\s*${name}\\(\\);`, "g"), "");
  drops.push(`function ${name}`);
}

/** Delete a block that a React component now owns. */
function drop(label, re) {
  const hits = s.match(new RegExp(re.source, re.flags.replace("g", "") + "g")) || [];
  if (hits.length !== 1) throw new Error(`drop site not unique (${hits.length}): ${label}`);
  s = s.replace(re, "\n");
  drops.push(label);
}

// --- 0. Remove everything React now owns ---------------------------------
// Each of these bound handlers or toggled classes that React components manage
// declaratively; leaving them in makes jQuery and React fight over className.
drop("meanmenu init", /\s*\$\('#mobile-menu'\)\.meanmenu\(\{[\s\S]*?\}\);/);
drop("mean-expand handler", /\s*\$documentOn\.on\("click", "\.mean-expand"[\s\S]*?\n\s*\}\);/);
drop("offcanvas link click", /\s*\$\("\.offcanvas a"\)\.on\("click"[\s\S]*?\n\s*\}\);/);
drop("offcanvas open", /\s*\$\("\.sidebar__toggle"\)\.on\("click"[\s\S]*?\n\s*\}\);/);
drop("offcanvas close", /\s*\$\("\.offcanvas__close, \.offcanvas__overlay"\)\.on\("click"[\s\S]*?\n\s*\}\);/);
drop("sticky header", /\s*\$windowOn\.on\("scroll", function \(\) \{\s*if \(\$\(this\)\.scrollTop\(\) > 250\)[\s\S]*?\n\s*\}\);/);
drop("back-to-top scroll", /\s*\$windowOn\.on\('scroll', function\(\) \{[\s\S]*?removeClass\("show"\);\s*\}\s*\}\);/);
drop("back-to-top click", /\s*\$documentOn\.on\('click', '#back-top'[\s\S]*?\n\s*\}\);/);
drop("nice-select init", /\s*if \(\$\('\.single-select'\)\.length\) \{\s*\$\('\.single-select'\)\.niceSelect\(\);\s*\}/);
drop("preloader hide", /\s*function hidePreloader\(\)[\s\S]*?\$windowOn\.on\("load", hidePreloader\);\s*\}/);
/**
 * Strip every `new Swiper(...)` construction — the React <Slider> component
 * owns those now. Walks back to the start of the declaration so the whole
 * statement goes, not just the call.
 */
function dropSwipers() {
  let removed = 0;
  for (;;) {
    const at = s.indexOf("new Swiper(");
    if (at === -1) break;

    // Back up over `const foo = ` / `var foo = ` if present.
    let start = at;
    const before = s.lastIndexOf(";", at);
    const braceBefore = s.lastIndexOf("{", at);
    const anchor = Math.max(before, braceBefore);
    // Anchored at the end so a preceding comment block does not defeat the match.
    const between = s.slice(anchor + 1, at);
    const decl = /(?:const|let|var)\s+[A-Za-z0-9_$]+\s*=\s*$/.exec(between);
    if (decl) start = anchor + 1 + decl.index;

    // Forward to the matching close paren of the call.
    let depth = 0;
    let k = s.indexOf("(", at);
    for (; k < s.length; k++) {
      if (s[k] === "(") depth += 1;
      else if (s[k] === ")") {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    let end = k + 1;
    if (s[end] === ";") end += 1;

    s = s.slice(0, start) + s.slice(end);
    removed += 1;
  }
  drops.push(`${removed} Swiper constructions`);
}
dropSwipers();

function sub(label, from, to) {
  if (!s.includes(from)) throw new Error(`patch site missing: ${label}`);
  if (s.split(from).length - 1 !== 1) throw new Error(`patch site not unique: ${label}`);
  s = s.replace(from, to);
  edits.push(label);
}

// 1. Expose the ready callback, and clear stacked handlers each time it runs.
sub(
  "expose ready callback",
  "$documentOn.ready( function() {",
  `window.__templateReady = function() {
    // Handlers bound below use the .tpl namespace so re-running cannot stack them.
    $documentOn.off(".tpl");
    $windowOn.off(".tpl");
`,
);

sub(
  "close ready callback",
  "}); // End Document Ready Function",
  `    if (window.ScrollTrigger) { try { ScrollTrigger.refresh(); } catch (e) {} }
    window.__templateHasRun = true;
  }; // End Document Ready Function
  $documentOn.ready(window.__templateReady);`,
);

// 2. Namespace every global handler bound inside the callback.
for (const [label, from, to] of [
  ["sidebar-header click", '$documentOn.on("click", ".sidebar-header"', '$documentOn.on("click.tpl", ".sidebar-header"'],
  ["tilt resize", "$(window).on('resize', bindTilt)", "$(window).on('resize.tpl', bindTilt)"],
]) {
  sub(label, from, to);
}

// 3. ScrollSmoother owns #smooth-wrapper/#smooth-content, which live in the
//    persistent layout — create it once, then just let ScrollTrigger refresh.
sub(
  "ScrollSmoother guard",
  "if ($('#smooth-wrapper').length && $('#smooth-content').length) {",
  "if ($('#smooth-wrapper').length && $('#smooth-content').length && !(window.ScrollSmoother && ScrollSmoother.get())) {",
);

drop("WOW init", /\s*new WOW\(\)\.init\(\);/);
drop("image popup", /\s*\$\("\.img-popup"\)\.magnificPopup\([\s\S]*?\n\s*\}\);/);
drop("video popup", /\s*\$\("\.video-popup"\)\.magnificPopup\([\s\S]*?\n\s*\}\);/);
drop("counterup", /\s*\$\("\.count"\)\.counterUp\(\{[\s\S]*?\}\);/);
dropFunction("initRipples");

writeFileSync(
  OUT,
  `/* GENERATED by scripts/patch-main-js.mjs from main.js — do not hand-edit.\n   Re-runnable on client-side navigation via window.__templateReady(). */\n` + s,
);
console.log(`wrote ${OUT}`);
console.log(`removed ${drops.length} React-owned blocks: ${drops.join(", ")}`);
console.log(`applied ${edits.length} patches: ${edits.join(", ")}`);
