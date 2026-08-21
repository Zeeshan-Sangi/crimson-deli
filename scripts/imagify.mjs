/**
 * Phase 5: swap the template's <img> tags for next/image.
 *
 * next/image needs intrinsic width/height for a string src, so dimensions are
 * read straight out of the PNG/JPEG headers (no dependency needed) and cached —
 * ~500 unique files back ~2,300 references.
 *
 * SVGs are left as plain <img>: Next refuses to optimise them unless
 * dangerouslyAllowSVG is enabled, and they are already tiny.
 * data-background images are CSS backgrounds applied by jQuery and cannot be
 * expressed as next/image at all.
 */
import { openSync, readSync, closeSync, statSync } from "node:fs";

function read(path, length, position = 0) {
  const fd = openSync(path, "r");
  try {
    const buf = Buffer.alloc(length);
    readSync(fd, buf, 0, length, position);
    return buf;
  } finally {
    closeSync(fd);
  }
}

/** Intrinsic size from the file header. Returns null for unsupported formats. */
export function imageSize(path) {
  const head = read(path, 32);

  // PNG: 8-byte signature, then IHDR with width/height as big-endian uint32.
  if (head.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
  }

  // JPEG: walk the marker segments until a Start-Of-Frame carries the size.
  if (head[0] === 0xff && head[1] === 0xd8) {
    const size = statSync(path).size;
    const buf = read(path, size);
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i += 1; continue; }
      const marker = buf[i + 1];
      // SOF0..SOF15, excluding DHT (C4), JPG (C8) and DAC (CC).
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }

  return null;
}

const IMG_TAG = /<img\s[^>]*\/>/g;

export function imagify(src, cache = new Map(), publicDir = "public") {
  let out = "";
  let last = 0;
  let count = 0;
  let skipped = 0;
  let m;

  IMG_TAG.lastIndex = 0;
  while ((m = IMG_TAG.exec(src))) {
    const tag = m[0];
    const url = /\ssrc="([^"]+)"/.exec(tag)?.[1];
    if (!url || !url.startsWith("/assets/img/") || url.endsWith(".svg")) continue;
    if (/\s(?:width|height|fill)[=\s]/.test(tag)) continue; // already sized

    if (!cache.has(url)) {
      let dim = null;
      try { dim = imageSize(publicDir + url); } catch { dim = null; }
      cache.set(url, dim);
    }
    const dim = cache.get(url);
    if (!dim) { skipped += 1; continue; }

    out += src.slice(last, m.index);
    // `<img ` -> `<Image `, keeping every original attribute, plus intrinsic size.
    out += `<Image ${tag.slice(5, -2).trim()} width={${dim.width}} height={${dim.height}} />`;
    last = m.index + tag.length;
    count += 1;
  }

  out += src.slice(last);
  return { code: out, count, skipped };
}

export const IMAGE_IMPORT = 'import Image from "next/image";';

/**
 * The hero and breadcrumb art are CSS backgrounds applied by jQuery from
 * data-background, so next/image never sees them — yet they are the LCP element
 * on every page. Point them at the image optimizer's URL instead, which serves
 * WebP to browsers that accept it (hero-bg.jpg: 1603KB -> 64KB).
 *
 * 1920 is one of Next's default deviceSizes; the optimizer never upscales past
 * the source, so smaller art is unaffected.
 */
export function backgroundify(src) {
  let count = 0;
  const code = src.replace(/data-background="(\/assets\/img\/[^"]+)"/g, (_, url) => {
    count += 1;
    return `data-background="/_next/image?url=${encodeURIComponent(url)}&w=1920&q=75"`;
  });
  return { code, count };
}
