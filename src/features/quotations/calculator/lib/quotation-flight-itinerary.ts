import type {
  TFlightItineraryInputMode,
  TQuotationOption,
} from "@/types/quotation.type";

export const FLIGHT_ITINERARY_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif";

/** Before client-side compression. */
export const FLIGHT_ITINERARY_IMAGE_MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const MAX_OUTPUT_WIDTH_PX = 1200;
const JPEG_QUALITY = 0.82;
const TARGET_OUTPUT_BYTES = 400_000;

function estimateDataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.ceil((base64.length * 3) / 4);
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image file."));
    };
    image.src = objectUrl;
  });
}

export function getFlightItineraryMode(
  option: Partial<Pick<TQuotationOption, "flightItineraryMode">>,
): TFlightItineraryInputMode {
  return option.flightItineraryMode === "image" ? "image" : "text";
}

export function getFlightItineraryImage(
  option: Partial<Pick<TQuotationOption, "flightItineraryImage">>,
): string {
  return option.flightItineraryImage ?? "";
}

export function hasFlightItineraryContent(option: TQuotationOption): boolean {
  if (getFlightItineraryMode(option) === "image") {
    return Boolean(getFlightItineraryImage(option).trim());
  }
  return (option.flightSegments ?? []).length > 0;
}

export function isFlightItineraryImageMode(
  mode: TFlightItineraryInputMode | undefined,
): boolean {
  return mode === "image";
}

export async function compressFlightItineraryImage(
  file: File,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose a JPEG, PNG, WebP, or GIF image.");
  }

  if (file.size > FLIGHT_ITINERARY_IMAGE_MAX_UPLOAD_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const image = await loadImageFromFile(file);
  const scale = Math.min(1, MAX_OUTPUT_WIDTH_PX / image.width);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not process image.");
  }

  context.drawImage(image, 0, 0, width, height);

  let quality = JPEG_QUALITY;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);

  while (quality > 0.5 && estimateDataUrlBytes(dataUrl) > TARGET_OUTPUT_BYTES) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }

  return dataUrl;
}
