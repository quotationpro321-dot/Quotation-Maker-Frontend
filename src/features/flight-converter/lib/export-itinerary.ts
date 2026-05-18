import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

import {
  ITINERARY_EXPORT_THEME,
  type ItineraryExportTheme,
  ITINERARY_TABLE_MIN_WIDTH,
} from "./itinerary-table-layout";

const EXPORT_ROOT_ATTR = "data-export-root";

const EXPORT_ROOT_MIN_WIDTH_PX = ITINERARY_TABLE_MIN_WIDTH + 32;

/**
 * Active dashboard theme for exports — read from `<html class="dark">` (`ThemeProvider`
 * uses `attribute="class"`). Do not use `data-export-theme` on the preview node; it can lag
 * one React commit behind the real class after toggling.
 */
function getActiveExportTheme(): ItineraryExportTheme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function rowIsZebraRow(tr: Element | null | undefined): boolean {
  return tr instanceof HTMLElement && tr.classList.contains("export-row-alt");
}

function sanitizeCloneForCanvas(root: HTMLElement, theme: ItineraryExportTheme) {
  const p = ITINERARY_EXPORT_THEME[theme];

  root.style.setProperty("background-color", p.bg, "important");
  root.style.setProperty("color", p.fg, "important");
  root.style.setProperty("overflow", "visible", "important");
  root.style.setProperty("box-sizing", "border-box", "important");
  root.style.setProperty("width", "fit-content", "important");
  root.style.setProperty("max-width", "none", "important");
  root.style.setProperty("min-width", `${EXPORT_ROOT_MIN_WIDTH_PX}px`, "important");
  root.style.setProperty("margin-left", "0", "important");
  root.style.setProperty("margin-right", "0", "important");

  const scrollWrap = root.querySelector("[data-export-scroll]");
  if (scrollWrap instanceof HTMLElement) {
    scrollWrap.style.setProperty("overflow", "visible", "important");
    scrollWrap.style.setProperty("width", "100%", "important");
    scrollWrap.style.setProperty("max-width", "none", "important");
  }

  const table = root.querySelector("table");
  if (table instanceof HTMLElement) {
    table.style.setProperty("width", `${ITINERARY_TABLE_MIN_WIDTH}px`, "important");
    table.style.setProperty("min-width", `${ITINERARY_TABLE_MIN_WIDTH}px`, "important");
    table.style.setProperty("table-layout", "fixed", "important");
    table.style.setProperty("border-collapse", "collapse", "important");
  }

  root.querySelectorAll("*").forEach((node) => {
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === "img") {
      if (!(el instanceof HTMLImageElement)) return;
      el.crossOrigin = "anonymous";
      if (el.hasAttribute("data-export-airline-logo")) {
        el.style.setProperty("max-width", "100%", "important");
        el.style.setProperty("max-height", "48px", "important");
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
      el.style.setProperty("color", p.fg, "important");
      el.style.setProperty("border-color", p.border, "important");
      if (tag === "th") {
        el.style.setProperty("background-color", p.headerBg, "important");
      } else if (tag === "td") {
        const zebra = rowIsZebraRow(el.closest("tr"));
        el.style.setProperty("background-color", zebra ? p.rowAltBg : p.bg, "important");
      }
      el.style.setProperty("box-shadow", "none", "important");
      el.style.setProperty("outline", "none", "important");
      return;
    }

    if (el.classList.contains("export-airline-logo-wrap")) {
      el.style.setProperty("max-width", "100%", "important");
      el.style.setProperty("width", "100%", "important");
      el.style.setProperty("box-sizing", "border-box", "important");
      el.style.setProperty("overflow", "hidden", "important");
      el.style.setProperty("background-color", "transparent", "important");
      return;
    }

    el.style.setProperty("color", p.fg, "important");

    if (tag === "th") {
      el.style.setProperty("background-color", p.headerBg, "important");
    } else if (tag === "td") {
      const zebra = rowIsZebraRow(el.closest("tr"));
      el.style.setProperty("background-color", zebra ? p.rowAltBg : p.bg, "important");
    } else if (el.closest("td, th")) {
      el.style.setProperty("background-color", "transparent", "important");
    } else {
      el.style.setProperty("background-color", p.bg, "important");
    }

    el.style.setProperty("border-color", p.border, "important");
    el.style.setProperty("box-shadow", "none", "important");
    el.style.setProperty("outline", "none", "important");
  });

  const tightWidth = Math.max(root.scrollWidth, EXPORT_ROOT_MIN_WIDTH_PX);
  root.style.setProperty("width", `${tightWidth}px`, "important");
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

async function captureElementCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  await preloadImages(element);

  const theme = getActiveExportTheme();
  const palette = ITINERARY_EXPORT_THEME[theme];

  const captureWidth = Math.max(
    element.scrollWidth,
    element.offsetWidth,
    ITINERARY_TABLE_MIN_WIDTH,
  );
  const captureHeight = Math.max(element.scrollHeight, element.offsetHeight);

  return html2canvas(element, {
    scale: 2,
    backgroundColor: palette.canvasBg,
    useCORS: true,
    allowTaint: true,
    logging: false,
    width: captureWidth,
    height: captureHeight,
    windowWidth: captureWidth,
    windowHeight: captureHeight,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc) => {
      const root = clonedDoc.querySelector(`[${EXPORT_ROOT_ATTR}]`);
      if (root instanceof HTMLElement) {
        root.setAttribute("data-export-theme", theme);
        sanitizeCloneForCanvas(root, theme);
      }
    },
  });
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
    pdf.addImage(imgData, "PNG", margin, margin - offsetY, contentWidth, imgHeight);
    remaining -= printableHeight;
    offsetY += printableHeight;
    if (remaining > 0) pdf.addPage();
  }
}

export async function exportElementAsImage(element: HTMLElement, filename: string) {
  const canvas = await captureElementCanvas(element);
  downloadDataUrl(canvas.toDataURL("image/png"), filename);
}

export async function exportElementAsPdf(element: HTMLElement, filename: string) {
  const canvas = await captureElementCanvas(element);
  const imgData = canvas.toDataURL("image/png", 1.0);

  const isWide = canvas.width >= canvas.height * 0.85 || canvas.width > 900;
  const pdf = new jsPDF({
    orientation: isWide ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });

  addImageToPdfPaginated(pdf, imgData, canvas, 8);
  pdf.save(filename);
}

export async function copyElementHtml(element: HTMLElement): Promise<void> {
  const theme = getActiveExportTheme();
  let html = element.outerHTML;
  if (/data-export-theme="(?:light|dark)"/.test(html)) {
    html = html.replace(/data-export-theme="(?:light|dark)"/, `data-export-theme="${theme}"`);
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
