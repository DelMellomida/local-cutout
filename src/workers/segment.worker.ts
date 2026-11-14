/// <reference lib="webworker" />

import {
  AutoModel,
  AutoProcessor,
  RawImage,
  env,
  pipeline,
} from "@huggingface/transformers";
import type { BackgroundRemovalPipeline } from "@huggingface/transformers";
import { createBiRefNetFeeds } from "../lib/birefnet";
import { applyAlphaMask } from "../lib/mask";

const FAST_MODEL_ID = "Xenova/modnet";
const FAST_MODEL_REVISION = "7e0f55f28727b43369531f75e0539ecc4912af82";
const ACCURATE_MODEL_ID = "studioludens/birefnet-lite-512";
const ACCURATE_MODEL_REVISION = "962e67969ec6acec9c19fab76acee4f5e22e990c";
const WORKER_BUILD_ID = "2026-11-14-csp-blob-v1";

env.allowLocalModels = false;
env.useBrowserCache = true;
env.remoteHost = `${self.location.origin}/`;
env.remotePathTemplate = "model-files/{model}/resolve/{revision}/";

let segmenterPromise: Promise<BackgroundRemovalPipeline> | null = null;

type ProcessMessage = {
  type: "process";
  quality: "fast" | "accurate";
  pixels: ArrayBuffer;
  width: number;
  height: number;
};

type RetryMessage = { type: "retry" };

self.onmessage = async (event: MessageEvent<ProcessMessage | RetryMessage>) => {
  if (event.data.type === "retry") {
    segmenterPromise = null;
    self.postMessage({ type: "ready-to-retry" });
    return;
  }

  try {
    const { pixels, width, height, quality } = event.data;
    const sourcePixels = new Uint8ClampedArray(pixels);
    const data =
      quality === "accurate"
        ? await processAccurate(sourcePixels, width, height)
        : await processFast(sourcePixels, width, height);

    self.postMessage(
      {
        type: "result",
        quality,
        pixels: data.buffer,
        width,
        height,
      },
      { transfer: [data.buffer] },
    );
  } catch (error) {
    segmenterPromise = null;
    self.postMessage({
      type: "error",
      quality: event.data.quality,
      buildId: WORKER_BUILD_ID,
      message:
        error instanceof Error
          ? error.message
          : "The background model could not run.",
    });
  }
};

async function processFast(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): Promise<Uint8ClampedArray> {
  const segmenter = await getSegmenter();
  self.postMessage({ type: "status", quality: "fast", stage: "processing" });
  const output = await segmenter(new RawImage(pixels, width, height, 4));
  const result = Array.isArray(output) ? output[0] : output;
  return new Uint8ClampedArray(result.data);
}

async function processAccurate(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): Promise<Uint8ClampedArray> {
  self.postMessage({
    type: "status",
    quality: "accurate",
    stage: "loading",
    progress: 0,
  });

  const progress_callback = (progress: {
    status: string;
    progress?: number;
  }) => {
    if (
      (progress.status === "progress" ||
        progress.status === "progress_total") &&
      progress.progress !== undefined
    ) {
      self.postMessage({
        type: "status",
        quality: "accurate",
        stage: "loading",
        progress: Math.round(progress.progress),
      });
    }
  };

  const [model, processor] = await Promise.all([
    AutoModel.from_pretrained(ACCURATE_MODEL_ID, {
      revision: ACCURATE_MODEL_REVISION,
      dtype: "fp16",
      device: "webgpu",
      progress_callback,
    }),
    AutoProcessor.from_pretrained(ACCURATE_MODEL_ID, {
      revision: ACCURATE_MODEL_REVISION,
    }),
  ]);

  self.postMessage({
    type: "status",
    quality: "accurate",
    stage: "processing",
  });
  const source = new RawImage(pixels, width, height, 4);
  const inputs = await processor(source);
  const output = await model(createBiRefNetFeeds(inputs));
  const logits = output.logits ?? output.output_image;
  if (!logits) {
    throw new Error("The accurate model returned no alpha mask.");
  }

  const maskTensor = logits[0].sigmoid().mul(255).to("uint8");
  const mask = await RawImage.fromTensor(maskTensor).resize(width, height);
  const result = applyAlphaMask(pixels, mask.data);
  await model.dispose();
  return result;
}

function getSegmenter(): Promise<BackgroundRemovalPipeline> {
  if (!segmenterPromise) {
    self.postMessage({
      type: "status",
      quality: "fast",
      stage: "loading",
      progress: 0,
    });
    segmenterPromise = pipeline("background-removal", FAST_MODEL_ID, {
      revision: FAST_MODEL_REVISION,
      dtype: "q8",
      device: "wasm",
      progress_callback: (progress) => {
        if (
          progress.status === "progress" ||
          progress.status === "progress_total"
        ) {
          self.postMessage({
            type: "status",
            quality: "fast",
            stage: "loading",
            progress: Math.round(progress.progress),
          });
        }
      },
    });
  }

  return segmenterPromise;
}
