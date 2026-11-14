# Local Cutout

Local Cutout removes image backgrounds entirely in the browser. Images are never uploaded, and the
result is a transparent PNG with no account or watermark.

The public deployment target is `https://local-cutout.workers.dev` (not deployed yet).

## How it works

- Astro produces static, crawlable HTML.
- A browser Web Worker loads the pinned `Xenova/modnet` model through Transformers.js.
- On WebGPU devices, an optional Improve accuracy action loads pinned BiRefNet Lite after the fast
  result and reprocesses the same local pixels.
- PNG, JPG, and WebP files are validated, limited to 20 MB and 40 megapixels, and downscaled to a
  maximum 2,000-pixel side.
- The model runs in the worker with the WebAssembly backend. Previewing and PNG export happen in the
  browser tab.

To verify the privacy claim, open the browser developer tools, select the Network panel, and process
an image. The first run downloads the version-pinned ONNX runtime from jsDelivr and model files
through the site's restricted Cloudflare route from Hugging Face; no request body contains the
selected image.

## Local development

Requirements: Node 24.16.0 (see `.nvmrc`) and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro. Useful checks:

```sh
npm run check
npm run lint
npm test
npm run build
```

## Deployment

Cloudflare Workers Static Assets settings are committed in `wrangler.jsonc`.

```sh
npm run deploy
```

Before launch, replace the default `workers.dev` origin in `astro.config.mjs`, `public/robots.txt`,
and `public/sitemap.xml` if a custom domain is connected. Confirm HTTPS redirect and HSTS in the
Cloudflare dashboard.

## Model and licenses

The application code is Apache-2.0 licensed. The MODNet model is downloaded at runtime from revision
`7e0f55f28727b43369531f75e0539ecc4912af82` of `Xenova/modnet` and is Apache-2.0 licensed. Model
weights are not committed. Optional Accurate mode downloads the MIT-licensed
`studioludens/birefnet-lite-512` model at revision
`962e67969ec6acec9c19fab76acee4f5e22e990c`; its fp16 artifact is about 100 MB and requires WebGPU.
See `THIRD_PARTY_NOTICES.md` for dependencies and font licensing.

This is a best-effort open-source project with no support or uptime guarantee.
