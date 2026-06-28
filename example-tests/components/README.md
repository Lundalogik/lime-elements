# Component example-tests

Per-component browser tests that drive the real docs examples at
`#/debug/<tag>`. Two kinds of assertion live here:

- **Interaction** — DOM assertions (click, keyboard, emitted events). Portable;
  run anywhere, including the macOS host.
- **Visual regression** — `toHaveScreenshot` pixel comparison. Gated behind
  `RUN_VISUAL_SNAPSHOTS=1` and only run inside the pinned Playwright Docker
  image, so macOS development and Linux CI compare byte-identical pixels.

## Running

| Command | What it does |
| --- | --- |
| `npm run test:examples:components` | Host run. Interaction tests only; visual test is skipped. Rebuilds the docs first (`docs:rebuild`). |
| `npm run test:examples:visual` | Builds docs, runs the full suite (interaction + visual) inside Docker. |
| `npm run test:examples:visual:update` | Same, but regenerates the committed baselines (`--update-snapshots`). |

## Baselines

- Stored in `<spec>.ts-snapshots/` next to each spec (e.g.
  `menu.spec.ts-snapshots/menu-open.png`). Tracked in git.
- Generated/compared ONLY in `mcr.microsoft.com/playwright:v1.60.0-jammy`
  (= the CI runner OS). Never commit a macOS-generated baseline.
- After an intentional visual change, regenerate with
  `npm run test:examples:visual:update` and commit the updated PNGs.
- Keep the Docker image (digest-pinned in `scripts/visual-tests-docker.sh` and
  the `component-tests` CI job) in lockstep with `@playwright/test` in
  `package.json`. The tag in each comment (`v1.60.0-jammy`) is the
  human-readable handle for that digest.

Requires Docker for the visual commands.
