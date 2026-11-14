interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

const MODEL_PREFIX = "/model-files/";
const ALLOWED_REVISIONS: Record<string, ReadonlySet<string>> = {
  "Xenova/modnet": new Set([
    "main",
    "7e0f55f28727b43369531f75e0539ecc4912af82",
  ]),
  "studioludens/birefnet-lite-512": new Set([
    "main",
    "962e67969ec6acec9c19fab76acee4f5e22e990c",
  ]),
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith(MODEL_PREFIX)) {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const modelRequest = parseModelRequest(url.pathname);
    if (!modelRequest) {
      return new Response("Model file not found", { status: 404 });
    }

    const { model, revision, file } = modelRequest;
    const upstreamUrl = new URL(
      `https://huggingface.co/${model}/resolve/${revision}/${file}`,
    );
    upstreamUrl.search = url.search;

    const upstreamHeaders = new Headers();
    for (const name of [
      "accept",
      "if-modified-since",
      "if-none-match",
      "range",
    ]) {
      const value = request.headers.get(name);
      if (value) upstreamHeaders.set(name, value);
    }

    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers: upstreamHeaders,
      redirect: "follow",
    });
    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.delete("set-cookie");
    responseHeaders.set(
      "Cache-Control",
      revision === "main"
        ? "public, max-age=300"
        : "public, max-age=31536000, immutable",
    );
    responseHeaders.set("X-Content-Type-Options", "nosniff");

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  },
};

export function parseModelRequest(
  pathname: string,
): { model: string; revision: string; file: string } | null {
  const requestedPath = pathname.slice(MODEL_PREFIX.length);

  for (const [model, revisions] of Object.entries(ALLOWED_REVISIONS)) {
    const modelPrefix = `${model}/resolve/`;
    if (!requestedPath.startsWith(modelPrefix)) continue;

    const revisionAndFile = requestedPath.slice(modelPrefix.length);
    const separator = revisionAndFile.indexOf("/");
    if (separator < 1) return null;

    const revision = decodeURIComponent(revisionAndFile.slice(0, separator));
    const file = revisionAndFile.slice(separator + 1);
    if (!revisions.has(revision) || !isSafeFilePath(file)) return null;

    return { model, revision, file };
  }

  return null;
}

function isSafeFilePath(file: string): boolean {
  if (!file || file.includes("\\")) return false;
  return file.split("/").every((part) => part && part !== "." && part !== "..");
}
