/**
 * Replace the template's <select class="single-select"> elements with the React
 * NiceSelect component.
 *
 * The template styled these with the jquery.nice-select plugin, which rewrote
 * each <select> into a div/ul widget at runtime. NiceSelect renders that same
 * markup from React, so the plugin (and the jQuery it needs) can go.
 */
const SELECT = /<select([^>]*)>([\s\S]*?)<\/select>/g;
const OPTION = /<option[^>]*>([\s\S]*?)<\/option>/g;

export function selectify(src) {
  let count = 0;
  const code = src.replace(SELECT, (whole, attrs, body) => {
    if (!/single-select/.test(attrs)) return whole;

    const options = [];
    let m;
    OPTION.lastIndex = 0;
    while ((m = OPTION.exec(body))) options.push(m[1].trim().replace(/\s+/g, " "));
    if (options.length === 0) return whole;

    const className = /className="([^"]*)"/.exec(attrs)?.[1] ?? "single-select";
    count += 1;
    const list = options.map((o) => JSON.stringify(o)).join(", ");
    return `<NiceSelect className="${className}" options={[${list}]} />`;
  });
  return { code, count };
}

export const NICE_SELECT_IMPORT = 'import NiceSelect from "@/components/layout/nice-select";';
