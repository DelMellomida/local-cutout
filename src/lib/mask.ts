export function applyAlphaMask(
  source: Uint8ClampedArray,
  mask: Uint8Array | Uint8ClampedArray,
): Uint8ClampedArray {
  if (source.length !== mask.length * 4) {
    throw new Error("The alpha mask dimensions do not match the source image.");
  }

  const result = source.slice();
  for (let pixel = 0; pixel < mask.length; pixel += 1) {
    const alphaOffset = pixel * 4 + 3;
    result[alphaOffset] = Math.round((source[alphaOffset] * mask[pixel]) / 255);
  }
  return result;
}
