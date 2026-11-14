import { describe, expect, it } from "vitest";
import { parseModelRequest } from "./edge-worker";

describe("model proxy route", () => {
  it("accepts the pinned fast model", () => {
    expect(
      parseModelRequest(
        "/model-files/Xenova/modnet/resolve/7e0f55f28727b43369531f75e0539ecc4912af82/onnx/model_quantized.onnx",
      ),
    ).toEqual({
      model: "Xenova/modnet",
      revision: "7e0f55f28727b43369531f75e0539ecc4912af82",
      file: "onnx/model_quantized.onnx",
    });
  });

  it("accepts main only for model metadata lookups", () => {
    expect(
      parseModelRequest("/model-files/Xenova/modnet/resolve/main/config.json"),
    ).toEqual({
      model: "Xenova/modnet",
      revision: "main",
      file: "config.json",
    });
  });

  it("rejects other repositories and revisions", () => {
    expect(
      parseModelRequest("/model-files/other/repo/resolve/main/config.json"),
    ).toBeNull();
    expect(
      parseModelRequest(
        "/model-files/Xenova/modnet/resolve/untrusted/config.json",
      ),
    ).toBeNull();
  });

  it("rejects traversal paths", () => {
    expect(
      parseModelRequest(
        "/model-files/Xenova/modnet/resolve/main/../private.txt",
      ),
    ).toBeNull();
  });
});
