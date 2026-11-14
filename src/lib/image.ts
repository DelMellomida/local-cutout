export const MAX_FILE_BYTES = 20 * 1024 * 1024;
export const MAX_PIXELS = 40_000_000;
export const MAX_SIDE = 2_000;

export const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export type AcceptedImageType = (typeof ACCEPTED_TYPES)[number];

export type ValidationResult =
  { ok: true; type: AcceptedImageType } | { ok: false; message: string };

export async function validateImageFile(file: File): Promise<ValidationResult> {
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, message: "Choose an image smaller than 20 MB." };
  }

  if (file.size === 0) {
    return { ok: false, message: "That file is empty. Choose another image." };
  }

  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const detected = detectImageType(header);

  if (!detected) {
    return {
      ok: false,
      message:
        "Choose a PNG, JPG, or WebP image. Other file types are not supported.",
    };
  }

  if (file.type && file.type !== detected) {
    return {
      ok: false,
      message:
        "The file contents do not match its image type. Choose another image.",
    };
  }

  return { ok: true, type: detected };
}

export function detectImageType(bytes: Uint8Array): AcceptedImageType | null {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    bytes.length >= 12 &&
    ascii(bytes, 0, 4) === "RIFF" &&
    ascii(bytes, 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

function ascii(bytes: Uint8Array, start: number, end: number): string {
  return String.fromCharCode(...bytes.slice(start, end));
}

export function scaledDimensions(
  width: number,
  height: number,
  maxSide = MAX_SIDE,
) {
  const scale = Math.min(1, maxSide / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function safePngName(originalName: string): string {
  const stem = originalName
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-");
  return `${stem || "cutout"}-cutout.png`;
}
