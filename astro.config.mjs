import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://local-cutout.jhondel-tools.workers.dev",
  output: "static",
  build: {
    inlineStylesheets: "auto",
  },
});
