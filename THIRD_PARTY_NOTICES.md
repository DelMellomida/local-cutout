# Third-party notices

This project depends on third-party software and a runtime-downloaded model. The exact resolved tree
is recorded in `package-lock.json`. The production dependency inventory below was generated from that
lockfile on 2026-11-14; build and test dependencies are not shipped in the static site.

## Runtime model and font

| Component                            | Version/revision                           | License                   |
| ------------------------------------ | ------------------------------------------ | ------------------------- |
| Xenova/modnet model                  | `7e0f55f28727b43369531f75e0539ecc4912af82` | Apache-2.0                |
| studioludens/birefnet-lite-512 model | `962e67969ec6acec9c19fab76acee4f5e22e990c` | MIT                       |
| @fontsource-variable/dm-sans         | 5.3.0                                      | SIL Open Font License 1.1 |

## Browser runtime packages

| Package                   | Version                       | License      |
| ------------------------- | ----------------------------- | ------------ |
| @huggingface/transformers | 4.3.2                         | Apache-2.0   |
| @huggingface/jinja        | 0.5.13                        | MIT          |
| @huggingface/tokenizers   | 0.2.0                         | Apache-2.0   |
| onnxruntime-web           | 1.31.0-dev.20260914-8d85527a0 | MIT          |
| onnxruntime-common        | 1.31.0-dev.20260911-2a43ec07e | MIT          |
| flatbuffers               | 25.9.23                       | Apache-2.0   |
| guid-typescript           | 1.0.9                         | ISC          |
| long                      | 5.3.2                         | Apache-2.0   |
| platform                  | 1.3.6                         | MIT          |
| protobufjs                | 7.6.6                         | BSD-3-Clause |
| @protobufjs/aspromise     | 1.1.2                         | BSD-3-Clause |
| @protobufjs/base64        | 1.1.2                         | BSD-3-Clause |
| @protobufjs/codegen       | 2.0.5                         | BSD-3-Clause |
| @protobufjs/eventemitter  | 1.1.1                         | BSD-3-Clause |
| @protobufjs/fetch         | 1.1.1                         | BSD-3-Clause |
| @protobufjs/float         | 1.0.2                         | BSD-3-Clause |
| @protobufjs/path          | 1.1.2                         | BSD-3-Clause |
| @protobufjs/pool          | 1.1.0                         | BSD-3-Clause |
| @protobufjs/utf8          | 1.1.2                         | BSD-3-Clause |

The npm package also declares Node-only and optional dependencies used outside the browser bundle.
Their resolved licenses are: MIT (`@emnapi/runtime`, `@img/colour`, `@types/node`, `adm-zip`,
`define-data-property`, `define-properties`, `es-define-property`, `es-errors`,
`escape-string-regexp`, `globalthis`, `gopd`, `has-property-descriptors`, `matcher`, `object-keys`,
`onnxruntime-common@1.30.0`, `onnxruntime-node`, `serialize-error`, `undici-types`); Apache-2.0
(`detect-libc`, `sharp`); BSD-3-Clause (`global-agent`); ISC (`semver`); 0BSD (`tslib`); and MIT OR
CC0-1.0 (`type-fest`).

License texts and copyright notices are available in each package's installed directory and linked
upstream repository. Apache-2.0 text is also included in this repository's `LICENSE` file.

BiRefNet Lite's weights are published as MIT by their distributor. Some upstream training datasets
may carry separate restrictions; review those dataset terms before using the model commercially.
