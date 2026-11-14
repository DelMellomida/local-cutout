import { describe, expect, it } from "vitest";
import { createBiRefNetFeeds } from "./birefnet";

describe("createBiRefNetFeeds", () => {
  it("maps processor pixel values to the ONNX input name", () => {
    const tensor = { dims: [1, 3, 512, 512] };
    expect(createBiRefNetFeeds({ pixel_values: tensor })).toEqual({
      input_image: tensor,
    });
  });

  it("rejects missing processor output", () => {
    expect(() => createBiRefNetFeeds({})).toThrow("no pixel values");
  });
});
