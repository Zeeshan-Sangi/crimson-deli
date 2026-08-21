/**
 * Convert a Foodies HTML page body into a React TSX component.
 * Usage: node scripts/html2jsx.mjs _template/index-4.html src/components/template/home-4.tsx Home4
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const [, , inPath, outPath, exportName = "HomePage"] = process.argv;
if (!inPath || !outPath) {
  console.error("usage: node scripts/html2jsx.mjs <in.html> <out.tsx> [ExportName]");
  process.exit(1);
}

let html = readFileSync(inPath, "utf8");

// Keep only body inner HTML (before script tags at end)
const bodyOpen = html.search(/<body[^>]*>/i);
const bodyClose = html.search(/<\/body>/i);
if (bodyOpen === -1 || bodyClose === -1) {
  console.error("no <body> found");
  process.exit(1);
}
html = html.slice(html.indexOf(">", bodyOpen) + 1, bodyClose);

// Drop trailing script tags if any slipped in
html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
html = html.replace(/<!--<< All JS Plugins >>-->[\s\S]*/i, "");

// Asset paths → absolute public paths (local downloads)
html = html.replace(/(href|src)=["']assets\//g, '$1="/assets/');
html = html.replace(/(href|src)=["']\.\.\/assets\//g, '$1="/assets/');
html = html.replace(/data-background=["']assets\//g, 'data-background="/assets/');
// Rewrite the whole url(...) value, not just its opening: the template mixes
// quoted url('assets/x.jpg') and bare url(assets/x.jpg), and patching only the
// front of a bare one leaves an unterminated string whose URL keeps the ")".
html = html.replace(
  /url\(\s*(['"]?)((?:\.\.\/)?assets\/[^)'"]*)\1\s*\)/g,
  (_, _q, path) => `url('/${path.replace(/^\.\.\//, "")}')`,
);
// Internal page links → Next routes (index-4 is home)
html = html.replace(/href=["']index-4\.html["']/g, 'href="/"');
html = html.replace(/href=["']index\.html["']/g, 'href="/"');
html = html.replace(/href=["']([a-z0-9-]+)\.html["']/g, 'href="/$1"');

// HTML → JSX attribute fixes
html = html.replace(/\sclass=/g, " className=");
html = html.replace(/\sfor=/g, " htmlFor=");
html = html.replace(/\sautocomplete=/gi, " autoComplete=");
html = html.replace(/\sautofocus/gi, " autoFocus");
html = html.replace(/\schecked(?!=)/gi, " defaultChecked");
html = html.replace(/\sselected(?!=)/gi, " defaultSelected");
html = html.replace(/\sreadonly/gi, " readOnly");
html = html.replace(/\stabindex=/gi, " tabIndex=");
html = html.replace(/\scolspan=/gi, " colSpan=");
html = html.replace(/\srowspan=/gi, " rowSpan=");
html = html.replace(/\scellpadding=/gi, " cellPadding=");
html = html.replace(/\scellspacing=/gi, " cellSpacing=");
html = html.replace(/\sframeborder=/gi, " frameBorder=");
html = html.replace(/\sallowfullscreen/gi, " allowFullScreen");
html = html.replace(/\sstroke-width=/gi, " strokeWidth=");
html = html.replace(/\sstroke-linecap=/gi, " strokeLinecap=");
html = html.replace(/\sstroke-linejoin=/gi, " strokeLinejoin=");
html = html.replace(/\sfill-rule=/gi, " fillRule=");
html = html.replace(/\sclip-rule=/gi, " clipRule=");
html = html.replace(/\sclip-path=/gi, " clipPath=");
html = html.replace(/\sstop-color=/gi, " stopColor=");
html = html.replace(/\sstop-opacity=/gi, " stopOpacity=");
html = html.replace(/\sxmlns:xlink=/gi, " xmlnsXlink=");
html = html.replace(/\sxlink:href=/gi, " xlinkHref=");

// Remaining camelCase attribute renames
const ATTR_RENAMES = {
  maxlength: "maxLength", minlength: "minLength", novalidate: "noValidate",
  spellcheck: "spellCheck", contenteditable: "contentEditable", datetime: "dateTime",
  accesskey: "accessKey", crossorigin: "crossOrigin", srcset: "srcSet",
  usemap: "useMap", formaction: "formAction", autoplay: "autoPlay",
  playsinline: "playsInline", inputmode: "inputMode", charset: "charSet",
  srclang: "srcLang", referrerpolicy: "referrerPolicy", bgcolor: "bgColor",
  marginwidth: "marginWidth", marginheight: "marginHeight",
};
for (const [from, to] of Object.entries(ATTR_RENAMES)) {
  html = html.replace(new RegExp(`\\s${from}=`, "gi"), ` ${to}=`);
}

// Empty-string boolean attributes: required="" → required (JSX types them as booleans)
const BOOL_ATTRS = [
  "required", "disabled", "readOnly", "multiple", "autoFocus", "allowFullScreen",
  "noValidate", "hidden", "open", "async", "defer", "controls", "loop", "muted",
  "playsInline", "reversed", "itemScope", "formNoValidate", "defaultChecked",
  "defaultSelected",
];
html = html.replace(new RegExp(`\\s(${BOOL_ATTRS.join("|")})=["']["']`, "g"), " $1");

// Attributes React types as numbers: maxLength="3" → maxLength={3}
const NUM_ATTRS = [
  "maxLength", "minLength", "rows", "cols", "size", "span", "colSpan",
  "rowSpan", "tabIndex", "start", "marginWidth", "marginHeight",
];
html = html.replace(
  new RegExp(`\\s(${NUM_ATTRS.join("|")})=["'](-?\\d+)["']`, "g"),
  " $1={$2}",
);

// Comments that break JSX
html = html.replace(/<!--([\s\S]*?)-->/g, "{/*$1*/}");

// Self-close void tags that may be unclosed
html = html.replace(/<(img|input|br|hr|meta|link|source|area|col|embed|param|track|wbr)([^>]*?)(?<!\/)>/gi, "<$1$2 />");

// style="a:b" → style={{a:"b"}} rough converter
html = html.replace(/\sstyle="([^"]*)"/g, (_, css) => {
  const obj = css
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const i = pair.indexOf(":");
      if (i === -1) return null;
      let key = pair.slice(0, i).trim();
      let val = pair.slice(i + 1).trim();
      key = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (/^\d+(\.\d+)?(px|em|rem|%)?$/.test(val) && !val.endsWith("%") && !/[a-z]/i.test(val)) {
        // keep as string always for safety
      }
      return `${key}: "${val.replace(/"/g, '\\"')}"`;
    })
    .filter(Boolean)
    .join(", ");
  return ` style={{${obj}}}`;
});

const out = `/* Auto-converted from ${inPath} by scripts/html2jsx.mjs — do not hand-edit, re-run the script */
export default function ${exportName}() {
  return (
    <>
${html}
    </>
  );
}
`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, out);
console.log(`written ${outPath} (${out.length} chars)`);
