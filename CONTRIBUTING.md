# Contributing

Thanks for improving Local Cutout.

## Setup

Use Node 24.16.0 and run `npm ci`, then `npm run dev`.

Before opening a pull request, run:

```sh
npm run check
npm run lint
npm test
npm run build
```

Keep changes focused. Do not add analytics, image uploads, model weights, secrets, or dependencies
without explaining the privacy, licensing, bundle-size, and Content Security Policy effects. New
dependencies must have a redistribution-compatible license and be recorded in
`THIRD_PARTY_NOTICES.md`.

Pull requests should explain the user-visible change, verification performed, and any browser or
accessibility limitations. By participating, you agree to follow the Code of Conduct.
