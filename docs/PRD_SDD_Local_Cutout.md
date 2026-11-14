# PRD + SDD: Local Cutout

A one-day practice project: build and deploy Local Cutout, a web tool that removes image backgrounds entirely in the browser. Part A is the PRD (what and why), Part B is the SDD (how), and Part C is your to-do list.

## A1. Overview (PRD)

The product is a free website that removes an image's background in the browser, so the photo never leaves the user's device.

**Problem.** Most online background removers send your photo to a server, which is slower and a privacy risk. People who just need one quick cutout also don't want an account or a watermark.

**Primary user.** Someone preparing a product photo, profile picture or sticker who wants a transparent PNG in under a minute, with no signup.

**Secondary user (you).** Practicing the full cycle: write the spec, build with AI, deploy, optimize for search, and audit the design.

**Success metrics** (targets are proposals; change them if you disagree):

| Metric | Target | How to check |
| --- | --- | --- |
| Live public URL on Cloudflare | By end of day | Open it on a phone and a laptop |
| Requests that carry image data | 0 | Browser DevTools, Network tab |
| Drop-to-download time, typical 2 MP photo, model already cached | 10 s or less | Stopwatch on your own laptop |
| Lighthouse mobile scores (Performance, Accessibility, Best Practices, SEO) | 90 or higher each | Lighthouse in Chrome DevTools |
| AI-look design audit | 80/100 or higher | Audit prompt from the checklist in A5 |
| Submitted to Google Search Console | Day 1 (indexing itself takes longer) | Search Console sitemap report |

**Non-goals for v1.** Accounts, history or cloud storage; batch processing; advanced editing such as feathering, brush hardness or multi-level undo; swapping in a new background; a paid tier or public API.

## A2. Functional requirements

Priorities use MoSCoW: Must, Should, Could, Won't (for v1). Each requirement is written as a user story with a pass/fail check.

| ID | User story | Priority | Acceptance criteria |
| --- | --- | --- | --- |
| FR-1 | As a user, I can add an image by drag-and-drop or a file picker | Must | PNG, JPG and WebP files are accepted; the file picker works with the keyboard |
| FR-2 | As a user, I'm told if my file can't be used | Must | Wrong file type or a file over the size limit shows a plain-language message, no crash. Proposed limit: 20 MB |
| FR-3 | As a user, I get my image with the background removed | Must | Subject kept, background transparent, on the test photos listed in B5 |
| FR-4 | As a user, I see progress while the model downloads and runs | Must | First visit shows a progress indicator; later visits skip the download |
| FR-5 | As a user, I can download the result as a PNG | Must | File has an alpha channel and opens transparent in another app |
| FR-6 | As a user, I can start over with another image | Must | One click resets the page, no reload needed |
| FR-7 | As a user, I'm told my image stays on my device | Must | A one-line privacy note is visible near the upload area |
| FR-8 | As a user, I can compare before and after | Should | Toggle or slider between original and result |
| FR-9 | As a user, I can preview the result on a checkerboard or a chosen color | Should | At least checkerboard, white and black previews |
| FR-10 | As a user, I can paste an image from the clipboard | Could | Ctrl/Cmd+V adds the image |
| FR-11 | As a user, I can use the tool offline after the first visit | Won't (v1) | Revisit after launch |
| FR-12 | As a user, I can manually correct the cutout | Should | Restore paints original pixels back; Erase makes pixels transparent; brush size and one-stroke undo work with pointer or touch input |
| FR-13 | As a user, I can request a more accurate result on supported hardware | Should | After the fast result, WebGPU browsers can opt into BiRefNet Lite; the larger model downloads only after that click; failure keeps the fast result intact |

The tool needs no backend for any of these requirements.

## A3. Non-functional requirements

These set the quality bar. Numbers marked "proposed" are my starting targets, not standards you must meet.

| Area | Requirement | Check |
| --- | --- | --- |
| Privacy | Image data is never sent over the network. Only the model files are downloaded | DevTools Network tab shows no upload |
| Performance | Page content loads before the model does; the model downloads only after the user adds an image or clicks a button. Proposed: Largest Contentful Paint 2.5 s or less on mobile | Lighthouse mobile |
| Responsiveness | The page never freezes while processing. Inference runs off the main thread | Add a 10 MB image and keep scrolling |
| Large images | Images are downscaled before processing. Proposed max side: 2000 px | Test with a 6000 px photo |
| Browser support | Current Chrome, Firefox, Safari and Edge on desktop; Chrome and Safari on mobile. WebGPU is optional, with a fallback | Manual test per browser |
| Accessibility | Aim for WCAG 2.2 AA: keyboard-operable, visible focus, color contrast, labels, alt text | Lighthouse plus a keyboard-only walkthrough |
| Reliability | If the model fails to load, show a retry button and a clear message | Block the model URL in DevTools and reload |
| Security | No third-party scripts. Set a Content Security Policy and other security headers | Check response headers after deploy |
| Cost | $0 to run on Cloudflare's free static hosting | Check Cloudflare dashboard usage |
| Maintainability | TypeScript in strict mode, a linter, and deployment on every Git push | CI/build passes |

## A4. SEO requirements

The day-one SEO goal is a site that search engines can crawl, understand and load quickly. Ranking on a competitive query like "remove background" takes weeks or longer, so plan for that.

| Area | Requirement |
| --- | --- |
| Rendering | Page copy is in the HTML at build time, so crawlers can read it without running JavaScript. Only the tool itself loads as a client-side component |
| Pages (v1) | Home (tool plus explanation), How it works with FAQ, Privacy, and a 404. Add use-case pages (product photos, profile pictures) only if keyword research supports them |
| Title tag | Unique per page, about 60 characters or fewer, main keyword near the front |
| Meta description | Unique per page, about 155 characters or fewer, says what it does and that it's free and private |
| Headings | One H1 per page that names the task, such as "Remove image backgrounds in your browser"; H2s for sections |
| URLs and canonicals | Short, lowercase, hyphenated URLs; a canonical tag on every page; HTTPS (Cloudflare provides it) |
| Social previews | Open Graph and Twitter card tags with a 1200 x 630 px preview image |
| Structured data | JSON-LD using the WebApplication type (name, description, category, free price). Google's software app rich result requires name, offers.price and a rating or review, so a free tool with no reviews probably won't get the rich result. Keep the markup anyway and never invent ratings; validate in the Rich Results Test |
| Crawl files | robots.txt that allows crawling and points to the sitemap; sitemap.xml listing every page |
| Images | Descriptive alt text; explicit width and height to prevent layout shift; WebP or AVIF for example images |
| Core Web Vitals | Google's "good" thresholds: Largest Contentful Paint 2.5 s or less, Interaction to Next Paint 200 ms or less, Cumulative Layout Shift 0.1 or less |
| Content | Specific copy about how it works and why it's private. No filler or buzzwords (see the copy rules in A5) |
| Internal links | Home links to How it works and Privacy; the same footer on every page |

**Launch steps**

- Deploy to the final domain (see B3).
- Verify the site in Google Search Console and Bing Webmaster Tools.

- Submit sitemap.xml in both.
- Run the Lighthouse SEO audit and the Rich Results Test on the live URL.

- Optional: add privacy-friendly analytics.
- Check the Search Console pages report after 2 to 4 weeks to see what's indexed.

Keyword research, competitor review and the domain choice are in your to-do list (C2).

## A5. Design and UI requirements

The design rules come from the [30-point AI-look checklist](https://aitoolpick.org/blog/ai-generated-website-checklist/), which lists six categories of patterns that make a site look AI-generated. Its claim that Google penalizes generic design is the author's view; the rules are still sound usability advice. The table turns each category into a rule for this project.

| Category | Avoid | Do in this project |
| --- | --- | --- |
| Colors | Purple-to-blue gradients, gradient buttons, shadows on everything, alternating gray and white sections, 5+ colors | One base color plus one accent. Flat buttons with a subtle hover. Borders instead of shadows. Change a section's background only when the content shifts |
| Typography | Inter, Roboto or Open Sans everywhere; one font for all text; uniform size steps | Pick one of DM Sans, Plus Jakarta Sans, Sora or Geist (the checklist's suggestions), self-hosted. Different weight or spacing for headings and body. A much larger H1. Heading line height 1.1 to 1.3, body 1.6 to 1.8. Tighter letter spacing on large headings |
| Layout | Three identical cards repeated; everything centered; the full-screen SaaS hero with two buttons | The tool is the hero: the drop zone sits above the fold. Mix one-column, two-column and list layouts. Left-align body text. Vary spacing between sections |
| Copy | Buzzwords (unlock, empower, seamless), "Learn more" buttons, vague headings like "Features" | Concrete verbs: "Choose image", "Download PNG". Specific headings like "What stays on your device". One-sentence subtitles |
| Images and icons | Emoji as icons, mismatched stock photos, AI illustrations, gradient placeholder boxes | SVG icons from Lucide. Before and after examples from real photos you have the rights to. If there's no real image, design without one |
| UX and interaction | Everything dumped at once, scroll-reveal animations, identical components, tiny tap targets, 3+ buttons per section | One primary action (choose an image) and at most one secondary. No scroll animations. Touch targets at least 44 x 44 px. Short FAQ in an accordion |

**Home page order, top to bottom**

- Header with the product name and links to How it works and Privacy.
- Hero: H1, one-line subtitle, and the drop zone.

- Result area (appears after processing): before and after, optional Improve accuracy, Restore and Erase brushes, preview background options, Download PNG.
- How it works: three short steps as a list, not cards.

- Privacy note and FAQ accordion.
- Footer.

**States to design:** empty, drag-over, downloading the fast model, fast processing, done, downloading the accurate model, accurate processing, non-destructive accurate-mode failure, manual editing, invalid file, and fast-model failure.

**Design check before launch.** Run the checklist's quick test: screenshot the page at full width, remove the text mentally and ask if the layout is still distinctive, and show it to someone and ask if it looks like a template. Then paste the checklist's audit prompt plus your page's HTML or a screenshot into an AI tool and fix the top three issues. Target: 80/100 or higher.

## A6. Open source requirements

The repo will be public, so it needs a license choice, a license check on everything you ship, and a few standard files. The bar is "tidy and safe enough for strangers to use and contribute to", not a full community program. Copy standard templates instead of writing these from scratch.

| Item | Requirement |
| --- | --- |
| License for your code | MIT or Apache-2.0. Both are permissive; Apache-2.0 adds an explicit patent grant. Decide in C2 |
| Dependency licenses | Record each dependency's license in a THIRD_PARTY_NOTICES file. Your license doesn't change their terms, so check that none restrict public redistribution |
| Model files | Don't commit model weights. Download them from their source at runtime or with a script. The README states the model's own license and that commercial reuse needs a model that allows it |
| Example images | Photos in the repo are redistributed with it. Use only photos you own or that carry a reuse license, and credit them |
| README | What it is, the live link, how to verify the privacy claim, how to run and build it, how to deploy it, and a license section |
| Contribution files | CONTRIBUTING.md (setup, lint, test, pull request expectations), CODE_OF_CONDUCT.md, issue and pull request templates |
| Security policy | SECURITY.md that says how to report a vulnerability privately (GitHub private vulnerability reporting or an email address) |
| Repo hygiene | .gitignore, .editorconfig, a committed lockfile, a pinned Node version, and no secrets or personal data in the code or history |
| Automation | GitHub Actions that build, lint and type-check every pull request; Dependabot for dependency updates; secret scanning turned on |
| Maintainer expectations | The README says "best effort, no support guarantee", so you're not on call |

## B1. System design (SDD)

The product is a static website plus client-side code. There is no server code, database or user data to store.

**How an image moves through the page**

- The user adds a file by drop or file picker.
- The page checks the type (PNG, JPG, WebP) and size (proposed limit 20 MB).

- The image is decoded and downscaled to 2000 px on its longest side.
- First use only: the MODNet model and runtime files download, with a progress bar. The browser caches them.

- The pixels go to a Web Worker that runs quantized MODNet over WebAssembly and returns the fast cutout.
- On a WebGPU browser, the user can click Improve accuracy before manual editing. The worker is replaced, the approximately 100 MB fp16 BiRefNet Lite model downloads on demand, and the same local pixels are reprocessed. If this fails, the fast result remains visible and downloadable.
- The page applies the mask as the image's alpha channel and shows before and after.
- Restore copies pixels from the retained original image; Erase clears alpha. The editor supports brush size and one-stroke undo. Starting a brush edit disables Improve accuracy for that result.

- On download, the result is encoded as a PNG file.
- On reset, the page frees the image memory and object URLs.

**Components**

| Component | Responsibility | Notes |
| --- | --- | --- |
| Static pages | All copy, meta tags and JSON-LD | Built at deploy time |
| Uploader | Drag-drop, file picker, validation, keyboard support | Plain, accessible form controls |
| Processing worker | Loads pinned MODNet or optional pinned BiRefNet Lite, runs inference, and returns RGBA pixels | Keeps the page responsive; each accurate attempt replaces the fast worker to release model memory |
| Compositor | Applies the mask, draws previews on checkerboard or color | Canvas |
| Manual editor | Restores original pixels or erases alpha with a configurable brush | Canvas pointer events; one-stroke undo |
| Exporter | Encodes the PNG and triggers the download |  |
| UI state | idle, loading fast model, fast processing, done, loading accurate model, accurate processing, editing, error | Accurate failure is inline and preserves the fast result; reset returns to idle |

**Suggested project layout**

src/
  pages/        index, how-it-works, privacy, 404
  components/   Uploader, ResultView
  lib/          validate.ts, resize.ts, composite.ts, export.ts
  workers/      segment.worker.ts
public/         robots.txt, og-image.png, favicon

**Data handling.** Images exist only in memory in the user's tab. No cookies, accounts or storage are needed. If you add analytics later, choose one that sets no cookies and update the privacy page to match.

## B2. Tech stack

The stack favors widely used tools that AI coding assistants know well and that suit SEO: Astro for static HTML, TypeScript for safety, and an in-browser ML runtime.

| Layer | Choice | Why | Alternative |
| --- | --- | --- | --- |
| Site framework | Astro, static output | Ships real HTML for search engines and very little JavaScript. The tool loads as a client-side component | Vite + React with prerendering |
| Language | TypeScript, strict mode | Catches mistakes in AI-written code early | Plain JavaScript |
| Tool UI | Vanilla TypeScript in an Astro component | Keeps the interactive surface small and dependency-free | Preact or React |
| Styling | Plain scoped CSS with shared design variables | Avoids a styling build dependency while preserving project-specific tokens | Tailwind CSS |
| Background removal | Transformers.js with MODNet q8/WASM by default and optional BiRefNet Lite fp16/WebGPU | Fast, broad default plus an explicit higher-accuracy path; both run in a Web Worker | A hosted API would break the privacy goal |
| Fonts | One self-hosted family from A5 | Faster and no third-party request | Google Fonts |
| Icons | Lucide (SVG) | Matches the checklist, no emoji | Heroicons, Phosphor |
| Quality | ESLint, Prettier, Lighthouse | Catches issues before deploy |  |
| Testing | Vitest for logic, Playwright for end-to-end (optional for day one) | Repeatable checks | Manual testing only |
| Hosting | Cloudflare (see B3) | Free static hosting, global CDN, HTTPS | Vercel, Netlify |

**Model choice matters for licensing.** The [RMBG-1.4 model card](https://huggingface.co/briaai/RMBG-1.4/blob/refs%2Fpr%2F21/README.md) says the model is source-available for non-commercial use and needs a commercial agreement otherwise, so this project avoids RMBG-1.4 and RMBG-2.0. @imgly/background-removal is also out: it is AGPL-3.0, which conflicts with this project's Apache-2.0 license. The fast model is MODNet (Xenova/modnet, Apache-2.0), pinned at `7e0f55f28727b43369531f75e0539ecc4912af82`. The optional accurate model is the browser-ready 512 px fp16 export `studioludens/birefnet-lite-512` (MIT), pinned at `962e67969ec6acec9c19fab76acee4f5e22e990c`. Its artifact is approximately 98.5 MB and loads only after the user clicks Improve accuracy. Review the upstream training-dataset terms again before any commercial use.

| Model (Hugging Face repo) | License | Notes |
| --- | --- | --- |
| MODNet (Xenova/modnet): fast default | Apache-2.0 | q8 artifact is 6.63 MB; runs over WASM for broad browser support. Primarily trained for portrait matting. |
| BiRefNet Lite (studioludens/birefnet-lite-512): optional accurate mode | MIT | Browser-ready 512 px fp16 export, approximately 98.5 MB; WebGPU only; intended for difficult edges and general objects. |
| ormbg (onnx-community/ormbg-ONNX) | Apache-2.0 per a third-party mirror | About 308 MB. Confirm the license upstream. |
| ISNet (onnx-community/ISNet-ONNX) | AGPL-3.0 per a third-party mirror | Skip: conflicts with Apache-2.0. |
| RMBG-1.4 and RMBG-2.0 (briaai) | Non-commercial (Bria licenses) | Excluded by the permissive-license decision. RMBG-2.0 weights are 885 MB. |

## B3. Deployment on Cloudflare

The implementation uses Cloudflare Workers Static Assets. Cloudflare's official [Static Assets guide](https://developers.cloudflare.com/workers/static-assets/get-started/) supports deploying the generated `dist` directory with Wrangler, while [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/) can connect the repository and deploy on each push. Cloudflare Pages remains possible, but it is not the configured path for this repository.

| Topic | Pages | Workers Static Assets |
| --- | --- | --- |
| Deploy from Git | Connect the repo; set a build command and output directory | Workers Builds: connect the repo and set build and deploy commands. Or run npx wrangler deploy yourself |
| Where settings live | Dashboard | wrangler.jsonc in your repo |
| Static file requests | Free and unlimited | Free and unlimited when no Worker script runs |
| Preview deployments | Yes | Yes |
| Free build allowance | 500 builds per month | 3,000 build minutes per month |
| Cloudflare's guidance for new projects | Keeps working | Recommended |

**Implemented Workers Static Assets path**

- Create a GitHub repo and push the Astro project.
- Run npm run build. Astro writes the site to dist.

- Use the committed `wrangler.jsonc` below. Its static-asset directory is `./dist`, and unknown paths use the built `404.html` page.
- Run npx wrangler deploy, then open the URL it prints.

- Connect the repo to Workers Builds so every push deploys.
- Add a custom domain in the Cloudflare dashboard.

```jsonc
{
  "name": "local-cutout",
  "compatibility_date": "2026-11-14",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```

**If you deliberately switch to Pages instead:** create a Pages project from the Git repository, set the build command to `npm run build` and the output directory to `dist`. This is an alternative deployment, not the maintained default.

**Deploy early.** Push an empty "hello" page to Cloudflare in the first 30 minutes, so deployment problems show up before you've built anything.

**Headers and model files**

- Security headers: `public/_headers` allows WebAssembly, Web Workers, same-origin model requests and the pinned runtime's jsDelivr host. Test the browser console and live response headers after deployment.
- Runtime and model files: Transformers.js selects a version-pinned ONNX WebAssembly runtime from jsDelivr. Vite also emits an unused 25.6 MiB local fallback, so `public/.assetsignore` excludes that fallback from the Cloudflare upload. Both pinned models load through the allowlisted `/model-files/` Worker route, which streams only the named repositories and revisions from Hugging Face. This avoids browser CORS and privacy-shield failures without sending image data to the Worker. MODNet q8 is 6.63 MB; BiRefNet Lite fp16 is approximately 98.5 MB and cannot fit Cloudflare's 25 MiB per-file static-asset limit. The privacy page discloses the runtime and model hosts.

- Custom domain: the default workers.dev or pages.dev address works for testing, but use your own domain for the SEO launch.

## B4. Security and reliability baseline

CAP doesn't apply to this project, and the plan already covers about half of a sensible security baseline. This section fills in the rest at a "little below production" level.

**Does CAP apply?** No. CAP describes the trade-off a distributed data store makes between consistency and availability when the network splits. This app has no database, shared state or accounts, so there's nothing to trade off. Files come from Cloudflare's network and the processing happens on the user's device.

The nearest real issue is version skew. [Cloudflare's Static Assets docs](https://developers.cloudflare.com/workers/static-assets/index.md) say that during a deployment, requests for a page and its assets can briefly use different versions. For this project that means:

- Use content-hashed file names for scripts and styles. Astro's default build does this; confirm it in the dist folder.
- Pin exact versions of the ML runtime and the model revision, so a code release always matches its model files.

- Deploy normally. Skip gradual rollouts, which make skew more likely.
- If a script fails to load because the visitor has an old tab open, show "A new version is available. Reload the page."

**What the plan already follows, and what to add**

| Principle | In the plan already? | Add |
| --- | --- | --- |
| Availability | Yes: static files on a CDN, no server to fail | Nothing |
| Consistency | Partly: no shared data, but version skew exists | Hashed file names, pinned versions, reload message (above) |
| Partition tolerance | Not needed | A retry button if the model download fails |
| Least privilege, small attack surface | Yes: no backend, no secrets, no API keys | Keep it that way: no third-party scripts |
| Privacy by design | Yes (A3) | Re-check the Network tab after every release |
| Defense in depth | Partly: a Content Security Policy is mentioned in B3 | The headers listed below |
| Input validation | Partly: type and size checks (FR-2) | Pixel limit, real type check, safe display of file names |
| Supply chain security | No | Lockfile, audit, Dependabot, pinned versions |
| Responsible disclosure | No | SECURITY.md (A6) |
| Graceful failure | Partly: error states in A5 | Retry and reload messages |

**Headers to set** in the _headers file:

- Content-Security-Policy: allow your own origin for scripts, styles and images (plus data: and blob: for canvas images), blob workers, WebAssembly ('wasm-unsafe-eval'), and the model host only if you load the model from a CDN. Add frame-ancestors 'none' to block embedding.
- X-Content-Type-Options: nosniff.

- Referrer-Policy: strict-origin-when-cross-origin.
- Permissions-Policy: switch off camera, microphone and location.

- HTTPS only: confirm HTTPS redirect and HSTS in the Cloudflare dashboard.

**Input handling**

- Accept only PNG, JPG and WebP. Check the real file type by decoding it, not just the extension. Don't accept SVG.
- Cap file size (20 MB) and pixel count (proposed: 40 megapixels) before full decoding, and wrap decoding in error handling.

- Display file names as plain text, never as HTML.
- Release image memory when the user starts over.

**Supply chain**

- Keep dependencies few. Commit the lockfile, install with npm ci in CI, and run npm audit in CI.
- Before installing a package an AI suggests, check that it exists, is maintained and is what you expect.

- Host the runtime and WebAssembly files yourself if their licenses and Cloudflare's file-size limit allow it.

**Skipped on purpose** (fine for below production; revisit if the project gets real traffic or contributors):

- A formal threat model or penetration test
- Uptime monitoring and alerts beyond the Cloudflare dashboard

- End-to-end tests on every pull request (run them by hand from B5)
- A software bill of materials and signed releases

- Load testing, since delivery is static and CDN-based
- Accessibility testing with real assistive-technology users

- Rollback automation. To roll back, redeploy the previous Git commit

## B5. Test plan and acceptance

The project is done when every box below is checked on the live URL.

**Function**

- ☐ A portrait photo gives a clean cutout
- ☐ An object on a plain background gives a clean cutout

- ☐ Hair, fur, low contrast and busy backgrounds work acceptably (rough edges on fine detail are expected from a small model)
- ☐ A 10 MB+ and a 6000 px image don't freeze the tab

- ☐ A non-image file and an oversized file each show a clear message
- ☐ The downloaded PNG is transparent when opened in another app

- ☐ Start over works, and a second image processes correctly
- ☐ Restore and Erase update the alpha result, brush size changes the stroke, one-stroke undo works, and the edited canvas downloads correctly
- ☐ On a WebGPU browser, Improve accuracy loads only when clicked and produces a usable BiRefNet result
- ☐ Accurate-mode failure shows plain-language help and leaves the fast result visible, downloadable and editable
- ☐ On a browser without WebGPU, Accurate mode is disabled with an explanation while the fast path still works

**Privacy and security**

- ☐ DevTools Network tab shows no request carrying image data
- ☐ Response headers include the Content Security Policy

**Open source and supply chain**

- ☐ LICENSE, README, CONTRIBUTING, CODE_OF_CONDUCT and SECURITY files are in the repo
- ☐ THIRD_PARTY_NOTICES lists every dependency and the model with its license

- ☐ No model files or secrets are in the repo or its history
- ☐ CI passes on a pull request; Dependabot and secret scanning are on

- ☐ npm audit shows no high or critical issues, or each one is explained
- ☐ After deploying twice, an old open tab shows the reload message instead of a broken page

**Browsers and devices**

- ☐ Works on current Chrome and Firefox, plus Safari or Edge, plus one mobile browser

**Accessibility**

- ☐ The whole flow works with the keyboard only, with visible focus
- ☐ The drop zone has a label that a screen reader announces

**Performance and SEO**

- ☐ Lighthouse mobile is 90 or higher in all four categories
- ☐ Core Web Vitals are within the thresholds in A4

- ☐ The Rich Results Test accepts the JSON-LD (a warning about a missing rating or review is expected)
- ☐ robots.txt and sitemap.xml load; every page has one H1, a unique title and description, and a canonical tag

- ☐ The link preview looks right when pasted into a chat app

**Design**

- ☐ The AI-look audit from A5 scores 80/100 or higher
- ☐ Touch targets are at least 44 x 44 px on a phone

**Deployment**

- ☐ Public URL works over HTTPS, and the 404 page shows for a missing path
- ☐ Custom domain connected (if you chose one)

## C1. Build plan and risks

The initial MVP was scoped for about 8 hours. The implemented product also includes the optional accurate pass and the manual Restore/Erase editor; future work should not expand beyond the acceptance criteria without a new decision.

- **Setup and first deploy (45 min):** Astro, TypeScript and scoped plain CSS; GitHub repo; push an empty page to Cloudflare.
- **Static pages and design tokens (1 hr):** layout, colors, one font family, header, footer, real copy.

- **Core tool (2 hrs):** upload, validation, MODNet worker, mask, PNG download.
- **Accuracy and editing (implemented after the MVP):** opt-in BiRefNet/WebGPU pass, friendly non-destructive fallback, Restore/Erase brushes, brush size and one-stroke undo.
- **States and polish (1 hr):** fast and accurate loading, friendly errors, before and after, preview backgrounds.

- **SEO (1 hr):** meta tags, JSON-LD, sitemap, robots.txt, preview image.
- **Test and fix (1 hr):** work through B5.

- **Design audit (30 min):** run the A5 audit and fix the top three issues.
- **Launch (1 hr):** open source files from A6, custom domain, Search Console, Bing Webmaster Tools.

**Working with the AI**

- Give it this doc as context and ask for one step at a time.
- Commit after each working step so you can roll back.

- Run the build, the linter and the B5 checks yourself instead of trusting "it works".
- Read each diff for network calls or new packages you didn't ask for. That protects the privacy promise.

**Risks**

| Risk | Impact | Mitigation |
| --- | --- | --- |
| The model's license doesn't fit your plans | You can't use it as intended | Verify before building (C2). MODNet is Apache-2.0. Avoid RMBG models and AGPL packages such as @imgly/background-removal |
| Large model, slow first load on mobile | Visitors leave and Core Web Vitals suffer | Load the model only after a user action; show progress; try a smaller or quantized model |
| WebGPU isn't available or accurate inference fails | Optional accurate mode is unavailable | Keep MODNet/WASM as the default; disable Accurate with an explanation or preserve the fast result after failure; retain Restore and Erase |
| Cloudflare's per-file size limit blocks self-hosted model files | Deploy fails | Check the limit first; load from the model hub's CDN or store files elsewhere |
| Strict Content Security Policy blocks the worker or WebAssembly | Tool works locally but fails live | Test headers on a preview URL early |
| AI-written code adds hidden requests or packages | Breaks the privacy claim | Review diffs; check the Network tab; check new packages |
| SEO results are slow | Disappointment | Judge day one on correctness; check Search Console after 2 to 4 weeks |
| Scope creep | Not finished in a day | Follow the cut order above |

## C2. Your to-do: decide, find, set up

Do the first group before you start building, since the answers change what the AI writes. The last two groups can happen in parallel.

**Decisions (locked)**

| Decision | Choice | Why |
| --- | --- | --- |
| Use and revenue | Free: no ads, no paid tier | Keeps the project non-commercial |
| Model and runtime | Pinned MODNet q8/WASM as the fast default; pinned `studioludens/birefnet-lite-512` fp16/WebGPU as an optional accurate pass | Preserves fast, broad support while offering better difficult-edge handling only when requested; both are permissively licensed |
| Hosting | Cloudflare Workers Static Assets | Recommended for new projects; settings live in the repo so forks can deploy the same way |
| Site framework | Astro (static output) with TypeScript | Real HTML pages for SEO; JavaScript only for the tool |
| License for your code | Apache-2.0 | Short and common; covers only your own code |
| Name and domain | Local Cutout (repo and Worker name: local-cutout); start on the free workers.dev address and add a custom domain later | No yearly cost for day one |
| Font and accent | DM Sans with one deep green accent | Follows the A5 rules |

**Find and verify**

- ☑ Model chosen: MODNet (Xenova/modnet, Apache-2.0). ISNet is AGPL-3.0 and RMBG is non-commercial, so both are out
- ☑ MODNet pinned to `7e0f55f28727b43369531f75e0539ecc4912af82`; q8 artifact confirmed at 6.63 MB
- ☑ Browser-ready BiRefNet Lite pinned to `962e67969ec6acec9c19fab76acee4f5e22e990c`; fp16 artifact is approximately 98.5 MB

- ☑ @imgly/background-removal is AGPL-3.0 and conflicts with Apache-2.0: dropped
- ☑ @huggingface/transformers pinned to 4.3.2; MODNet background removal and the BiRefNet input/mask adapters have focused tests

- ☑ Cloudflare's per-file limit for static assets is 25 MiB (confirmed in the Workers limits docs, Nov 14, 2026). Larger model files must load from the Hugging Face CDN
- ☐ Keyword research: 5 to 10 phrases people search (Google autocomplete and related searches are free; Google Trends compares phrases)

- ☐ The top 5 results for your main phrase: what pages they have, how they title them, what they answer
- ☑ Google's software app rich result requires name, offers.price and a rating or review. A free tool with no reviews likely won't qualify; keep the markup and don't invent ratings

- ☐ Name check: local-cutout is free as a GitHub repo and a workers.dev subdomain (fallback: cutout-local)
- ☑ DM Sans is self-hosted through @fontsource and recorded as SIL Open Font License 1.1

**Set up**

- ☐ GitHub account and an empty repo
- Already have a github account

- ☐ Cloudflare account (free plan is enough)
- Done

- ☐ Node.js LTS installed locally
- Done

- ☐ Google Search Console and Bing Webmaster Tools accounts, ready for launch
- Not yet, will do after development

**Gather**

- ☐ 5 test photos you own or that are licensed for reuse: a portrait, a product, a pet, a low-contrast shot, and one with hair or fur
- ☐ 2 or 3 before-and-after example images from those photos, for the home page

**Open source and security**

- ☐ Choose a license for your code: MIT or Apache-2.0 (A6)
- Use the Apache-2.0

- ☑ Production dependencies and both models are recorded in THIRD_PARTY_NOTICES
- ☑ Both models download through a restricted same-origin Worker route from pinned Hugging Face revisions; the version-pinned ONNX runtime loads from jsDelivr; no weights are committed; the CSP allows only the browser-facing hosts

- ☐ Read Cloudflare's [version skew guidance](https://developers.cloudflare.com/workers/versions-and-deployments/version-skew/) before your first deploy
- ☐ Turn on GitHub's Dependabot, secret scanning and private vulnerability reporting

- ☑ CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, issue template and pull-request template are committed
- ☐ Confirm the HTTPS redirect and HSTS settings in the Cloudflare dashboard

## Sources

Pages opened for this doc, as of Nov 14, 2026:

- [How to Make Your Website Not Look AI-Generated (30-Point Checklist), AIToolPick](https://aitoolpick.org/blog/ai-generated-website-checklist/): design rules in A5
- [Static Assets, Cloudflare Workers docs](https://developers.cloudflare.com/workers/static-assets/get-started/): how the built site is configured and deployed in B3
- [Workers Builds configuration, Cloudflare Workers docs](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/): repository build and deploy commands in B3
- [RMBG-1.4 model card, Hugging Face](https://huggingface.co/briaai/RMBG-1.4/blob/refs%2Fpr%2F21/README.md): why RMBG models are avoided in B2

- [MODNet model card (Xenova/modnet), Hugging Face](https://huggingface.co/Xenova/modnet): Apache-2.0 license and Transformers.js usage in B2
- [Browser-ready BiRefNet Lite model card (studioludens/birefnet-lite-512), Hugging Face](https://huggingface.co/studioludens/birefnet-lite-512): MIT license, 512 px WebGPU export, fp16 size and browser-memory rationale in B2
- [Workers limits, Cloudflare docs](https://developers.cloudflare.com/workers/platform/limits/): 25 MiB static asset file limit in B3 and C2
- [Static Assets configuration, Cloudflare Workers docs](https://developers.cloudflare.com/workers/static-assets/binding/#ignoring-assets): `.assetsignore` behavior used for the unused ONNX runtime fallback in B3

- [Software app structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/software-app): required properties for the rich result in A4
- [@imgly/background-removal, npm](https://npmjs.com/package/@imgly/background-removal): AGPL license in B2

The SEO thresholds, Core Web Vitals targets, security headers and open source checklist come from general practice rather than a page I opened. Verify the current details using the C2 list. Licenses marked "per a third-party mirror" were not confirmed on the upstream model cards.
