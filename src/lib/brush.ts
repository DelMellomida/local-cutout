export type BrushMode = "restore" | "erase";

export function paintBrush(
  pixels: Uint8ClampedArray,
  original: Uint8ClampedArray,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  radius: number,
  mode: BrushMode,
): void {
  const startX = Math.max(0, Math.floor(centerX - radius));
  const endX = Math.min(width - 1, Math.ceil(centerX + radius));
  const startY = Math.max(0, Math.floor(centerY - radius));
  const endY = Math.min(height - 1, Math.ceil(centerY + radius));
  const radiusSquared = radius * radius;

  for (let y = startY; y <= endY; y += 1) {
    for (let x = startX; x <= endX; x += 1) {
      const deltaX = x - centerX;
      const deltaY = y - centerY;
      if (deltaX * deltaX + deltaY * deltaY > radiusSquared) continue;

      const offset = (y * width + x) * 4;
      if (mode === "erase") {
        pixels[offset + 3] = 0;
      } else {
        pixels[offset] = original[offset];
        pixels[offset + 1] = original[offset + 1];
        pixels[offset + 2] = original[offset + 2];
        pixels[offset + 3] = original[offset + 3];
      }
    }
  }
}
