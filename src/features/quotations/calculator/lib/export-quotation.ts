import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const EXPORT_ROOT_ATTR = "data-quotation-export-root";
const EXPORT_PADDING = 3;
const EXPORT_SCALE = 3;
const CSS_PX_PER_MM = 96 / 25.4;
const CANVAS_BG = "#ffffff";

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

function measureExportHeight(element: HTMLElement): number {
  const content = element.querySelector("[data-quotation-export-content]");
  const target =
    content instanceof HTMLElement ? content : element;
  return Math.ceil(
    Math.max(target.scrollHeight, target.offsetHeight, target.getBoundingClientRect().height),
  );
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
  const canvas = await captureElementCanvas(element);
  downloadDataUrl(canvas.toDataURL("image/png"), filename);
}

export async function exportQuotationAsPdf(
  element: HTMLElement,
  filename: string,
) {
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

export { EXPORT_ROOT_ATTR };
