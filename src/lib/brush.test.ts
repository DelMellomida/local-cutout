import { describe, expect, it } from "vitest";
import { paintBrush } from "./brush";

describe("paintBrush", () => {
  const original = new Uint8ClampedArray([
    10, 20, 30, 255, 40, 50, 60, 255, 70, 80, 90, 255,
  ]);

  it("restores original color and alpha inside the brush", () => {
    const result = new Uint8ClampedArray(original.length);
    paintBrush(result, original, 3, 1, 1, 0, 0.4, "restore");
    expect([...result.slice(4, 8)]).toEqual([40, 50, 60, 255]);
    expect(result[3]).toBe(0);
    expect(result[11]).toBe(0);
  });

  it("erases alpha without changing color", () => {
    const result = original.slice();
    paintBrush(result, original, 3, 1, 1, 0, 0.4, "erase");
    expect([...result.slice(4, 8)]).toEqual([40, 50, 60, 0]);
  });

  it("clips a brush at image edges", () => {
    const result = original.slice();
    expect(() =>
      paintBrush(result, original, 3, 1, -1, 0, 2, "erase"),
    ).not.toThrow();
  });
});
