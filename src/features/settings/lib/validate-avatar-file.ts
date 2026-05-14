const MAX_BYTES = 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/gif"]);

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED.has(file.type)) {
    return "Please choose a JPG, PNG, or GIF image.";
  }
  if (file.size > MAX_BYTES) {
    return "Image must be 1MB or smaller.";
  }
  return null;
}
