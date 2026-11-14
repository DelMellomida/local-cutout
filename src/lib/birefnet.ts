export function createBiRefNetFeeds(processed: Record<string, unknown>): {
  input_image: unknown;
} {
  const pixelValues = processed.pixel_values;
  if (!pixelValues) {
    throw new Error("BiRefNet preprocessing returned no pixel values.");
  }
  return { input_image: pixelValues };
}
