import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

import {
  AIRLINE_LOGO_MAX_HEIGHT,
  EXPORT_TABLE_FONT_FAMILY,
  ITINERARY_EXPORT_CANVAS_SCALE,
  ITINERARY_EXPORT_PADDING,
  ITINERARY_EXPORT_THEME,
  ITINERARY_TABLE_CELL_PADDING_X,
  ITINERARY_TABLE_COLUMN_KEYS,
  ITINERARY_TABLE_COLUMNS,
  ITINERARY_TABLE_MIN_WIDTH,
  type ItineraryExportTheme,
} from "./itinerary-table-layout";

const EXPORT_ROOT_ATTR = "data-export-root";

const EXPORT_CAPTURE_WIDTH =
  ITINERARY_TABLE_MIN_WIDTH + ITINERARY_EXPORT_PADDING * 2;

/** Columns that stay on one line during export capture. */
const EXPORT_NOWRAP_COLUMN_INDEXES = new Set([1, 2, 4, 8, 9]);

const CSS_PX_PER_MM = 96 / 25.4;

function getActiveExportTheme(): ItineraryExportTheme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function rowIsZebraRow(tr: Element | null | undefined): boolean {
  return tr instanceof HTMLElement && tr.classList.contains("export-row-alt");
}

function parseHexColor(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    return {
      r: Number.parseInt(normalized[0] + normalized[0], 16),
      g: Number.parseInt(normalized[1] + normalized[1], 16),
      b: Number.parseInt(normalized[2] + normalized[2], 16),
    };
  }
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function isBackgroundPixel(
  r: number,
  g: number,
  b: number,
  a: number,
  bg: { r: number; g: number; b: number },
): boolean {
  if (a < 12) return true;
  return (
    Math.abs(r - bg.r) <= 10 &&
    Math.abs(g - bg.g) <= 10 &&
    Math.abs(b - bg.b) <= 10
  );
}

/** Trim captured canvas to visible content + fixed padding (px at 1×). */
function trimCanvasToContent(
  canvas: HTMLCanvasElement,
  backgroundColor: string,
  paddingCssPx: number,
): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const bg = parseHexColor(backgroundColor);
  const padding = paddingCssPx * ITINERARY_EXPORT_CANVAS_SCALE;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (
        isBackgroundPixel(data[i], data[i + 1], data[i + 2], data[i + 3], bg)
      ) {
        continue;
      }
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (minX >= maxX || minY >= maxY) return canvas;

  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width - 1, maxX + padding);
  maxY = Math.min(height - 1, maxY + padding);

  const trimmedWidth = maxX - minX + 1;
  const trimmedHeight = maxY - minY + 1;
  const trimmed = document.createElement("canvas");
  trimmed.width = trimmedWidth;
  trimmed.height = trimmedHeight;

  const trimmedCtx = trimmed.getContext("2d");
  if (!trimmedCtx) return canvas;

  trimmedCtx.drawImage(
    canvas,
    minX,
    minY,
    trimmedWidth,
    trimmedHeight,
    0,
    0,
    trimmedWidth,
    trimmedHeight,
  );
  return trimmed;
}

function applyCellTheme(
  el: HTMLElement,
  theme: ItineraryExportTheme,
  tag: string,
) {
  const p = ITINERARY_EXPORT_THEME[theme];
  el.style.setProperty("color", p.fg, "important");
  el.style.setProperty("border-color", p.border, "important");
  el.style.setProperty("box-shadow", "none", "important");
  el.style.setProperty("outline", "none", "important");

  if (tag === "th") {
    el.style.setProperty("background-color", p.headerBg, "important");
  } else if (tag === "td") {
    const zebra = rowIsZebraRow(el.closest("tr"));
    el.style.setProperty(
      "background-color",
      zebra ? p.rowAltBg : p.bg,
      "important",
    );
  }
}

function applyFixedColumnWidths(table: HTMLElement) {
  const widths = ITINERARY_TABLE_COLUMN_KEYS.map(
    (key) => ITINERARY_TABLE_COLUMNS[key],
  );

  table.querySelectorAll("col").forEach((col, index) => {
    if (!(col instanceof HTMLElement)) return;
    const width = widths[index];
    if (width === undefined) return;

    col.style.setProperty("width", `${width}px`, "important");
    col.style.setProperty("min-width", `${width}px`, "important");
    col.style.setProperty("max-width", `${width}px`, "important");
  });

  table.querySelectorAll("tr").forEach((row) => {
    if (row instanceof HTMLElement) {
      row.style.setProperty("overflow", "hidden", "important");
    }

    row.querySelectorAll("th, td").forEach((cell, index) => {
      if (!(cell instanceof HTMLElement)) return;
      const width = widths[index];
      if (width === undefined) return;

      cell.style.setProperty("width", `${width}px`, "important");
      cell.style.setProperty("min-width", `${width}px`, "important");
      cell.style.setProperty("max-width", `${width}px`, "important");
      cell.style.setProperty("box-sizing", "border-box", "important");
      cell.style.setProperty("overflow", "hidden", "important");
      cell.style.setProperty("word-break", "break-word", "important");
      cell.style.setProperty("overflow-wrap", "break-word", "important");
      cell.style.setProperty(
        "white-space",
        EXPORT_NOWRAP_COLUMN_INDEXES.has(index) ? "nowrap" : "normal",
        "important",
      );
      cell.style.setProperty("vertical-align", "middle", "important");
      cell.style.setProperty("position", "relative", "important");
    });
  });
}

function sanitizeCloneForCanvas(
  root: HTMLElement,
  theme: ItineraryExportTheme,
  captureHeight?: number,
) {
  const p = ITINERARY_EXPORT_THEME[theme];
  const logoMaxWidth =
    ITINERARY_TABLE_COLUMNS.logo - ITINERARY_TABLE_CELL_PADDING_X;

  root.style.setProperty("background-color", p.bg, "important");
  root.style.setProperty("color", p.fg, "important");
  root.style.setProperty("font-family", EXPORT_TABLE_FONT_FAMILY, "important");
  root.style.setProperty("line-height", "1.45", "important");
  root.style.setProperty("letter-spacing", "0.01em", "important");
  root.style.setProperty("text-rendering", "geometricPrecision", "important");
  root.style.setProperty("-webkit-font-smoothing", "antialiased", "important");
  root.style.setProperty("overflow", "hidden", "important");
  root.style.setProperty("box-sizing", "border-box", "important");
  root.style.setProperty("width", `${EXPORT_CAPTURE_WIDTH}px`, "important");
  root.style.setProperty("min-width", `${EXPORT_CAPTURE_WIDTH}px`, "important");
  root.style.setProperty("max-width", `${EXPORT_CAPTURE_WIDTH}px`, "important");
  root.style.setProperty("min-height", "0", "important");
  root.style.setProperty("margin", "0", "important");
  root.style.setProperty(
    "padding",
    `${ITINERARY_EXPORT_PADDING}px`,
    "important",
  );

  if (captureHeight && captureHeight > 0) {
    root.style.setProperty("height", `${captureHeight}px`, "important");
  } else {
    root.style.setProperty("height", "auto", "important");
  }

  const scrollWrap = root.querySelector("[data-export-scroll]");
  if (scrollWrap instanceof HTMLElement) {
    scrollWrap.style.setProperty("overflow", "hidden", "important");
    scrollWrap.style.setProperty("width", "100%", "important");
    scrollWrap.style.setProperty("max-width", "none", "important");
  }

  const table = root.querySelector("table");
  if (table instanceof HTMLElement) {
    table.style.setProperty(
      "width",
      `${ITINERARY_TABLE_MIN_WIDTH}px`,
      "important",
    );
    table.style.setProperty(
      "min-width",
      `${ITINERARY_TABLE_MIN_WIDTH}px`,
      "important",
    );
    table.style.setProperty(
      "max-width",
      `${ITINERARY_TABLE_MIN_WIDTH}px`,
      "important",
    );
    table.style.setProperty("table-layout", "fixed", "important");
    table.style.setProperty("border-collapse", "collapse", "important");
    table.style.setProperty("overflow", "hidden", "important");
    applyFixedColumnWidths(table);
  }

  root.querySelectorAll("*").forEach((node) => {
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    el.style.setProperty("font-family", EXPORT_TABLE_FONT_FAMILY, "important");
    el.style.setProperty("line-height", "1.45", "important");
    el.style.setProperty("letter-spacing", "0.01em", "important");

    if (tag === "img") {
      if (!(el instanceof HTMLImageElement)) return;
      if (el.hasAttribute("data-export-airline-logo")) {
        el.style.setProperty("max-width", `${logoMaxWidth}px`, "important");
        el.style.setProperty(
          "max-height",
          `${AIRLINE_LOGO_MAX_HEIGHT}px`,
          "important",
        );
        el.style.setProperty("width", "auto", "important");
        el.style.setProperty("height", "auto", "important");
        el.style.setProperty("object-fit", "contain", "important");
        el.style.setProperty("display", "block", "important");
        el.style.setProperty("margin", "0 auto", "important");
      }
      return;
    }

    if (
      tag === "table" ||
      tag === "colgroup" ||
      tag === "col" ||
      tag === "tbody" ||
      tag === "thead" ||
      tag === "tr"
    ) {
      return;
    }

    if (el.hasAttribute("data-logo-cell")) {
      el.style.setProperty("overflow", "hidden", "important");
      el.style.setProperty("vertical-align", "middle", "important");
      el.style.setProperty("box-sizing", "border-box", "important");
      el.style.setProperty(
        "max-height",
        `${AIRLINE_LOGO_MAX_HEIGHT + 24}px`,
        "important",
      );
      applyCellTheme(el, theme, tag);
      return;
    }

    if (el.classList.contains("export-airline-logo-wrap")) {
      el.style.setProperty("max-width", "100%", "important");
      el.style.setProperty("width", "100%", "important");
      el.style.setProperty(
        "max-height",
        `${AIRLINE_LOGO_MAX_HEIGHT}px`,
        "important",
      );
      el.style.setProperty("box-sizing", "border-box", "important");
      el.style.setProperty("overflow", "hidden", "important");
      el.style.setProperty("background-color", "transparent", "important");
      return;
    }

    if (el.classList.contains("export-airline-logo-fallback")) {
      el.style.setProperty("max-width", "100%", "important");
      el.style.setProperty("overflow", "hidden", "important");
      el.style.setProperty("background-color", "transparent", "important");
      return;
    }

    el.style.setProperty("color", p.fg, "important");

    if (tag === "th" || tag === "td") {
      applyCellTheme(el, theme, tag);
    } else if (el.closest("td, th")) {
      el.style.setProperty("background-color", "transparent", "important");
    } else {
      el.style.setProperty("background-color", p.bg, "important");
    }

    el.style.setProperty("border-color", p.border, "important");
    el.style.setProperty("box-shadow", "none", "important");
    el.style.setProperty("outline", "none", "important");
  });
}

async function preloadImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalHeight > 0) {
            resolve();
            return;
          }
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          window.setTimeout(done, 2500);
        }),
    ),
  );
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

async function measureExportCaptureHeight(
  element: HTMLElement,
  theme: ItineraryExportTheme,
): Promise<number> {
  const probe = element.cloneNode(true) as HTMLElement;
  const host = document.createElement("div");
  host.style.cssText =
    "position:fixed;left:-10000px;top:0;opacity:0;pointer-events:none;z-index:-1;";
  host.appendChild(probe);
  document.body.appendChild(host);

  try {
    sanitizeCloneForCanvas(probe, theme);
    await preloadImages(probe);

    const table = probe.querySelector("table");
    if (!(table instanceof HTMLElement)) {
      return Math.max(probe.scrollHeight, probe.offsetHeight);
    }

    return Math.ceil(
      Math.max(
        table.scrollHeight,
        table.offsetHeight,
        table.getBoundingClientRect().height,
      ),
    );
  } finally {
    host.remove();
  }
}

async function captureElementCanvas(
  element: HTMLElement,
): Promise<HTMLCanvasElement> {
  await preloadImages(element);

  const theme = getActiveExportTheme();
  const palette = ITINERARY_EXPORT_THEME[theme];
  const tableHeight = await measureExportCaptureHeight(element, theme);
  const captureHeight = tableHeight + ITINERARY_EXPORT_PADDING * 2;

  const canvas = await html2canvas(element, {
    scale: ITINERARY_EXPORT_CANVAS_SCALE,
    backgroundColor: palette.canvasBg,
    useCORS: true,
    allowTaint: true,
    logging: false,
    width: EXPORT_CAPTURE_WIDTH,
    height: captureHeight,
    windowWidth: EXPORT_CAPTURE_WIDTH,
    windowHeight: captureHeight,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc) => {
      const root = clonedDoc.querySelector(`[${EXPORT_ROOT_ATTR}]`);
      if (root instanceof HTMLElement) {
        root.setAttribute("data-export-theme", theme);
        sanitizeCloneForCanvas(root, theme, captureHeight);
      }
    },
  });

  return trimCanvasToContent(
    canvas,
    palette.canvasBg,
    ITINERARY_EXPORT_PADDING,
  );
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function canvasCssSize(canvas: HTMLCanvasElement) {
  return {
    width: canvas.width / ITINERARY_EXPORT_CANVAS_SCALE,
    height: canvas.height / ITINERARY_EXPORT_CANVAS_SCALE,
  };
}

function addImageToPdfPaginated(
  pdf: jsPDF,
  imgData: string,
  canvas: HTMLCanvasElement,
  margin: number,
) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;
  const imgHeight = (canvas.height * contentWidth) / canvas.width;

  if (imgHeight <= printableHeight) {
    pdf.addImage(imgData, "PNG", margin, margin, contentWidth, imgHeight);
    return;
  }

  let offsetY = 0;
  let remaining = imgHeight;

  while (remaining > 0) {
    pdf.addImage(
      imgData,
      "PNG",
      margin,
      margin - offsetY,
      contentWidth,
      imgHeight,
    );
    remaining -= printableHeight;
    offsetY += printableHeight;
    if (remaining > 0) pdf.addPage();
  }
}

export async function exportElementAsImage(
  element: HTMLElement,
  filename: string,
) {
  const canvas = await captureElementCanvas(element);
  downloadDataUrl(canvas.toDataURL("image/png"), filename);
}

export async function exportElementAsPdf(
  element: HTMLElement,
  filename: string,
) {
  const canvas = await captureElementCanvas(element);
  const imgData = canvas.toDataURL("image/png", 1.0);
  const { width: cssWidth, height: cssHeight } = canvasCssSize(canvas);

  const marginMm = ITINERARY_EXPORT_PADDING / CSS_PX_PER_MM;
  const contentWidthMm = cssWidth / CSS_PX_PER_MM;
  const contentHeightMm = cssHeight / CSS_PX_PER_MM;
  const pageWidthMm = contentWidthMm + marginMm * 2;
  const pageHeightMm = contentHeightMm + marginMm * 2;

  if (pageWidthMm > 0 && pageHeightMm > 0 && Number.isFinite(pageWidthMm)) {
    const pdf = new jsPDF({
      orientation: pageWidthMm >= pageHeightMm ? "landscape" : "portrait",
      unit: "mm",
      format: [pageWidthMm, pageHeightMm],
    });

    pdf.addImage(
      imgData,
      "PNG",
      marginMm,
      marginMm,
      contentWidthMm,
      contentHeightMm,
    );
    pdf.save(filename);
    return;
  }

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });
  addImageToPdfPaginated(pdf, imgData, canvas, marginMm);
  pdf.save(filename);
}

export async function copyElementHtml(element: HTMLElement): Promise<void> {
  const theme = getActiveExportTheme();
  let html = element.outerHTML;
  if (/data-export-theme="(?:light|dark)"/.test(html)) {
    html = html.replace(
      /data-export-theme="(?:light|dark)"/,
      `data-export-theme="${theme}"`,
    );
  }
  const plain = element.innerText;

  if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plain], { type: "text/plain" }),
      }),
    ]);
    return;
  }

  await navigator.clipboard.writeText(plain);
}

export { EXPORT_ROOT_ATTR };
