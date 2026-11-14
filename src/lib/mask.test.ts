import { describe, expect, it } from "vitest";
import { applyAlphaMask } from "./mask";

describe("applyAlphaMask", () => {
  it("applies mask values while preserving RGB channels", () => {
    const source = new Uint8ClampedArray([10, 20, 30, 255, 40, 50, 60, 255]);
    expect([...applyAlphaMask(source, new Uint8Array([0, 128]))]).toEqual([
      10, 20, 30, 0, 40, 50, 60, 128,
    ]);
  });

  it("preserves existing source transparency", () => {
    const source = new Uint8ClampedArray([10, 20, 30, 128]);
    expect(applyAlphaMask(source, new Uint8Array([128]))[3]).toBe(64);
  });

  it("rejects a mask with different dimensions", () => {
    expect(() =>
      applyAlphaMask(new Uint8ClampedArray(8), new Uint8Array(1)),
    ).toThrow("dimensions do not match");
  });
});
