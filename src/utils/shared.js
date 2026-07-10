/* Degree / Numeric Helpers */
export function normalizeDeg(d) {
  d %= 360;
  return d < 0 ? d + 360 : d;
}

export function shortestDiffDeg(from, to) {
  return ((to - from + 540) % 360) - 180;
}

export function mod(n, m) {
  return ((n % m) + m) % m;
}

/* Random Helpers */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function rand(min, max) {
  return min + Math.random() * (max - min);
}

/* Text Helpers */
export function toTitleCase(text = "") {
  return text.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* Symbol Naming / Display Helpers */
export function toKebabCase(value = "") {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function symbolCssClassName(symbolName, base = "symbol") {
  const slug = toKebabCase(symbolName);
  return slug ? `${base}--${slug}` : "";
}

export function symbolAltText(symbol) {
  const altText = symbol?.altText;

  if (typeof altText === "string" && altText.trim()) {
    return altText.trim();
  }

  return symbol?.name ?? "";
}

export function symbolPreviewLabel(symbol) {
  const alt = symbolAltText(symbol);
  return alt ? `${alt} preview` : "Symbol preview";
}
