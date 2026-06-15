import type {
  TQuotationCalculatorTypeStates,
  TQuotationDraft,
} from "@/types/quotation.type";

export type TQuotationSharePayload = {
  draft: TQuotationDraft;
  activeOptionIndex: number;
  consultantName?: string;
  consultantWhatsapp?: string;
};

/**
 * Hash fragments never reach the server, so the only real bound is what
 * browsers/chat apps tolerate. Deflate keeps typical drafts well under this.
 */
const MAX_SHARE_URL_LENGTH = 60_000;

const BASE64_CHUNK_SIZE = 0x8000;

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += BASE64_CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + BASE64_CHUNK_SIZE));
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(token: string): Uint8Array {
  const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function pipeThroughStream(
  bytes: Uint8Array,
  transform: CompressionStream | DecompressionStream,
): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(transform);
  const buffer = await new Response(stream).arrayBuffer();
  return new Uint8Array(buffer);
}

/**
 * The shared page only renders the active calculator type, and never shows the
 * pasted raw itinerary — dropping both keeps tokens small enough for a URL.
 */
function buildShareDraft(draft: TQuotationDraft): TQuotationDraft {
  const emptyState = { options: [], activeOptionIndex: 0 };
  const activeState = draft.calculatorStates[draft.calculatorType];

  const calculatorStates: TQuotationCalculatorTypeStates = {
    umrah: emptyState,
    holiday: emptyState,
    flights: emptyState,
    [draft.calculatorType]: {
      ...activeState,
      options: activeState.options.map((option) => ({
        ...option,
        rawItinerary: "",
        flightSegments: option.flightSegments.map((segment) => ({
          ...segment,
          sourceLine: "",
        })),
      })),
    },
  };

  return { ...draft, calculatorStates };
}

export async function encodeQuotationShareToken(
  payload: TQuotationSharePayload,
): Promise<string> {
  const json = JSON.stringify(payload);
  const compressed = await pipeThroughStream(
    new TextEncoder().encode(json),
    new CompressionStream("deflate-raw"),
  );
  return toBase64Url(compressed);
}

export async function decodeQuotationShareToken(
  token: string,
): Promise<TQuotationSharePayload | null> {
  try {
    const decompressed = await pipeThroughStream(
      fromBase64Url(token),
      new DecompressionStream("deflate-raw"),
    );
    const json = new TextDecoder().decode(decompressed);
    const parsed = JSON.parse(json) as TQuotationSharePayload;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.draft ||
      typeof parsed.activeOptionIndex !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function buildQuotationShareUrl(
  draft: TQuotationDraft,
  activeOptionIndex: number,
  consultant?: { name?: string; whatsapp?: string },
  origin = typeof window !== "undefined" ? window.location.origin : "",
): Promise<string> {
  const token = await encodeQuotationShareToken({
    draft: buildShareDraft(draft),
    activeOptionIndex,
    consultantName: consultant?.name?.trim() || undefined,
    consultantWhatsapp: consultant?.whatsapp?.trim() || undefined,
  });
  return `${origin}/quotation/view#${token}`;
}

export async function copyQuotationShareLink(
  draft: TQuotationDraft,
  activeOptionIndex: number,
  consultant?: { name?: string; whatsapp?: string },
): Promise<string> {
  const url = await buildQuotationShareUrl(draft, activeOptionIndex, consultant);

  if (url.length > MAX_SHARE_URL_LENGTH) {
    throw new Error("QUOTATION_TOO_LARGE");
  }

  await navigator.clipboard.writeText(url);
  return url;
}
