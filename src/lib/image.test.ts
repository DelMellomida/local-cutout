import { describe, expect, it } from "vitest";
import { detectImageType, safePngName, scaledDimensions } from "./image";

describe("detectImageType", () => {
  it("recognizes PNG, JPEG, and WebP signatures", () => {
    expect(
      detectImageType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 13, 10, 26, 10])),
    ).toBe("image/png");
    expect(detectImageType(new Uint8Array([0xff, 0xd8, 0xff]))).toBe(
      "image/jpeg",
    );
    expect(
      detectImageType(
        new Uint8Array([82, 73, 70, 70, 1, 2, 3, 4, 87, 69, 66, 80]),
      ),
    ).toBe("image/webp");
  });

  it("rejects unknown content", () => {
    expect(detectImageType(new TextEncoder().encode("<svg></svg>"))).toBeNull();
  });
});

it("downscales without enlarging", () => {
  expect(scaledDimensions(6000, 3000)).toEqual({ width: 2000, height: 1000 });
  expect(scaledDimensions(800, 600)).toEqual({ width: 800, height: 600 });
});

it("creates a safe PNG filename", () => {
  expect(safePngName("My product!.JPG")).toBe("My-product--cutout.png");
});
