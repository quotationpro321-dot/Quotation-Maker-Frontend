import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

import {
  QUOTATION_A4_HEIGHT_PX,
  QUOTATION_A4_WIDTH_PX,
  UMRAH_QUOTATION_ASSETS,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah.constants";

const EXPORT_ROOT_ATTR = "data-quotation-export-root";
const EXPORT_PAGE_ATTR = "data-quotation-pdf-page";
const EXPORT_COVER_PAGE_ATTR = "data-quotation-cover-page";
const EXPORT_PADDING = 3;
const EXPORT_SCALE = 3;
const CSS_PX_PER_MM = 96 / 25.4;
const CANVAS_BG = "#ffffff";
const A4_PAGE_WIDTH_MM = 210;
const A4_PAGE_HEIGHT_MM = 297;

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

function trimCanvasToContent(
  canvas: HTMLCanvasElement,
  paddingCssPx: number,
): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const bg = parseHexColor(CANVAS_BG);
  const padding = paddingCssPx * EXPORT_SCALE;

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

function sanitizeCloneForExport(root: HTMLElement, captureHeight: number) {
  root.style.setProperty("background-color", CANVAS_BG, "important");
  root.style.setProperty("color", "#0f172a", "important");
  root.style.setProperty("overflow", "hidden", "important");
  root.style.setProperty("box-sizing", "border-box", "important");
  root.style.setProperty("margin", "0", "important");
  root.style.setProperty("padding", `${EXPORT_PADDING}px`, "important");
  root.style.setProperty("height", `${captureHeight}px`, "important");
  root.style.setProperty("max-width", "800px", "important");
}

function sanitizeFixedPageClone(page: HTMLElement) {
  page.style.setProperty("margin", "0", "important");
  page.style.setProperty("padding", "0", "important");
  page.style.setProperty("box-sizing", "border-box", "important");
  page.style.setProperty("overflow", "hidden", "important");

  if (page.hasAttribute(EXPORT_COVER_PAGE_ATTR)) {
    page.style.setProperty("background-color", "#000000", "important");
  }
}

function resolvePublicAssetUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return new URL(path, window.location.origin).href;
}

function getImageFormat(src: string): "PNG" | "JPEG" | "WEBP" {
  const normalized = src.split("?")[0]?.toLowerCase() ?? "";
  if (normalized.endsWith(".jpg") || normalized.endsWith(".jpeg")) return "JPEG";
  if (normalized.endsWith(".webp")) return "WEBP";
  return "PNG";
}

async function loadImageMeta(src: string): Promise<{
  dataUrl: string;
  width: number;
  height: number;
  format: "PNG" | "JPEG" | "WEBP";
}> {
  const url = resolvePublicAssetUrl(src);
  const format = getImageFormat(url);

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Could not prepare cover image for export."));
        return;
      }
      context.drawImage(image, 0, 0);
      const mimeType =
        format === "JPEG"
          ? "image/jpeg"
          : format === "WEBP"
            ? "image/webp"
            : "image/png";
      resolve({
        dataUrl: canvas.toDataURL(mimeType, 1),
        width: image.naturalWidth,
        height: image.naturalHeight,
        format,
      });
    };
    image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    image.src = url;
  });
}

function computeFullBleedPlacement(
  imageWidth: number,
  imageHeight: number,
  pageWidth: number,
  pageHeight: number,
) {
  const scale = Math.max(pageWidth / imageWidth, pageHeight / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    x: (pageWidth - width) / 2,
    y: (pageHeight - height) / 2,
    width,
    height,
  };
}

function isCoverPage(page: HTMLElement): boolean {
  return page.hasAttribute(EXPORT_COVER_PAGE_ATTR);
}

function getCoverImageSrc(page: HTMLElement): string {
  const image = page.querySelector("img");
  if (image?.getAttribute("src")) {
    return image.getAttribute("src") as string;
  }
  return UMRAH_QUOTATION_ASSETS.coverPage;
}

async function captureCoverPageCanvas(page: HTMLElement): Promise<HTMLCanvasElement> {
  const { dataUrl, width, height } = await loadImageMeta(getCoverImageSrc(page));
  const { width: pageWidth, height: pageHeight } = readFixedPageSize(page);
  const placement = computeFullBleedPlacement(width, height, pageWidth, pageHeight);

  const canvas = document.createElement("canvas");
  canvas.width = pageWidth * EXPORT_SCALE;
  canvas.height = pageHeight * EXPORT_SCALE;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not render cover page.");
  }

  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to draw cover page."));
    image.src = dataUrl;
  });

  context.drawImage(
    image,
    placement.x * EXPORT_SCALE,
    placement.y * EXPORT_SCALE,
    placement.width * EXPORT_SCALE,
    placement.height * EXPORT_SCALE,
  );

  return canvas;
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
}

function getExportPages(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(`[${EXPORT_PAGE_ATTR}]`),
  );
}

function measureExportHeight(element: HTMLElement): number {
  const content = element.querySelector("[data-quotation-export-content]");
  const target = content instanceof HTMLElement ? content : element;
  return Math.ceil(
    Math.max(
      target.scrollHeight,
      target.offsetHeight,
      target.getBoundingClientRect().height,
    ),
  );
}

function readFixedPageSize(page: HTMLElement) {
  const width = Math.ceil(
    page.offsetWidth ||
      Number.parseFloat(page.style.width) ||
      QUOTATION_A4_WIDTH_PX,
  );
  const height = Math.ceil(
    page.offsetHeight ||
      Number.parseFloat(page.style.height) ||
      QUOTATION_A4_HEIGHT_PX,
  );
  return { width, height };
}

async function captureFixedPageCanvas(
  page: HTMLElement,
): Promise<HTMLCanvasElement> {
  if (isCoverPage(page)) {
    return captureCoverPageCanvas(page);
  }

  await preloadImages(page);
  const { width: captureWidth, height: captureHeight } = readFixedPageSize(page);

  return html2canvas(page, {
    scale: EXPORT_SCALE,
    backgroundColor: null,
    useCORS: true,
    allowTaint: true,
    logging: false,
    width: captureWidth,
    height: captureHeight,
    windowWidth: captureWidth,
    windowHeight: captureHeight,
    onclone: (clonedDoc) => {
      const clonedPage = clonedDoc.querySelector(`[${EXPORT_PAGE_ATTR}]`);
      if (clonedPage instanceof HTMLElement) {
        sanitizeFixedPageClone(clonedPage);
      }
    },
  });
}

async function captureElementCanvas(
  element: HTMLElement,
): Promise<HTMLCanvasElement> {
  await preloadImages(element);
  const captureWidth = Math.max(
    Math.ceil(element.getBoundingClientRect().width) + EXPORT_PADDING * 2,
    400,
  );
  const contentHeight = measureExportHeight(element);
  const captureHeight = contentHeight + EXPORT_PADDING * 2;

  const canvas = await html2canvas(element, {
    scale: EXPORT_SCALE,
    backgroundColor: CANVAS_BG,
    useCORS: true,
    allowTaint: true,
    logging: false,
    width: captureWidth,
    height: captureHeight,
    windowWidth: captureWidth,
    windowHeight: captureHeight,
    onclone: (clonedDoc) => {
      const root = clonedDoc.querySelector(`[${EXPORT_ROOT_ATTR}]`);
      if (root instanceof HTMLElement) {
        sanitizeCloneForExport(root, captureHeight);
      }
    },
  });

  return trimCanvasToContent(canvas, EXPORT_PADDING);
}

async function captureExportCanvases(
  element: HTMLElement,
): Promise<HTMLCanvasElement[]> {
  const exportRoot =
    element.querySelector<HTMLElement>(`[${EXPORT_ROOT_ATTR}]`) ?? element;
  const pages = getExportPages(exportRoot);

  if (pages.length > 0) {
    await preloadImages(exportRoot);
    return Promise.all(pages.map((page) => captureFixedPageCanvas(page)));
  }

  return [await captureElementCanvas(element)];
}

function stackCanvasesVertically(canvases: HTMLCanvasElement[]): HTMLCanvasElement {
  if (canvases.length === 1) return canvases[0];

  const width = Math.max(...canvases.map((canvas) => canvas.width));
  const height = canvases.reduce((total, canvas) => total + canvas.height, 0);
  const stacked = document.createElement("canvas");
  stacked.width = width;
  stacked.height = height;

  const ctx = stacked.getContext("2d");
  if (!ctx) return canvases[0];

  let offsetY = 0;
  for (const canvas of canvases) {
    const offsetX = Math.floor((width - canvas.width) / 2);
    ctx.drawImage(canvas, offsetX, offsetY);
    offsetY += canvas.height;
  }

  return stacked;
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

export async function exportQuotationAsImage(
  element: HTMLElement,
  filename: string,
) {
  const canvases = await captureExportCanvases(element);
  const canvas = stackCanvasesVertically(canvases);
  downloadDataUrl(canvas.toDataURL("image/png"), filename);
}

export async function exportQuotationAsPdf(
  element: HTMLElement,
  filename: string,
) {
  const exportRoot =
    element.querySelector<HTMLElement>(`[${EXPORT_ROOT_ATTR}]`) ?? element;
  const pages = getExportPages(exportRoot);

  if (pages.length > 0) {
    const canvases = await captureExportCanvases(element);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    for (let index = 0; index < canvases.length; index++) {
      const page = pages[index];
      if (index > 0) pdf.addPage();

      if (page && isCoverPage(page)) {
        const { dataUrl, width, height, format } = await loadImageMeta(
          getCoverImageSrc(page),
        );
        const placement = computeFullBleedPlacement(
          width,
          height,
          A4_PAGE_WIDTH_MM,
          A4_PAGE_HEIGHT_MM,
        );
        pdf.addImage(dataUrl, format, placement.x, placement.y, placement.width, placement.height);
        continue;
      }

      pdf.addImage(
        canvases[index].toDataURL("image/png", 1.0),
        "PNG",
        0,
        0,
        A4_PAGE_WIDTH_MM,
        A4_PAGE_HEIGHT_MM,
      );
    }

    pdf.save(filename);
    return;
  }

  const canvas = await captureElementCanvas(element);
  const imgData = canvas.toDataURL("image/png", 1.0);
  const cssWidth = canvas.width / EXPORT_SCALE;
  const cssHeight = canvas.height / EXPORT_SCALE;
  const marginMm = EXPORT_PADDING / CSS_PX_PER_MM;
  const contentWidthMm = cssWidth / CSS_PX_PER_MM;
  const contentHeightMm = cssHeight / CSS_PX_PER_MM;
  const pageWidthMm = contentWidthMm + marginMm * 2;
  const pageHeightMm = contentHeightMm + marginMm * 2;

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
}

export { EXPORT_COVER_PAGE_ATTR, EXPORT_PAGE_ATTR, EXPORT_ROOT_ATTR };
