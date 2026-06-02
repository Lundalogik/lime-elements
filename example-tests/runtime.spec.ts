import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// This suite couples to three Kompendium internals; re-verify them when bumping
// the `kompendium` dependency, as a minor release can legitimately move any one
// and fail the whole suite:
//   1. the `#/debug/<tag>` route renders a single example in isolation,
//   2. the example renders inside a `.show-case_component` wrapper, and
//   3. `kompendium.json` exposes examples as `docs.components[].docsTags`.
// The `> 400` count guard below turns a silent enumeration break into a loud one.

// Enumerate every documented example from the built docs metadata. The
// `exampleComponent` doc tags are the examples actually shown in the docs, which
// is the same set the in-process smoke test covers — but here we load each one
// through the real `#/debug/<tag>` route, so it renders with the props the docs
// inject (e.g. the `schema` the composite playgrounds need).
const kompendiumPath = path.resolve(process.cwd(), 'www', 'kompendium.json');
const kompendium = JSON.parse(readFileSync(kompendiumPath, 'utf8')) as {
    docs: {
        components: Array<{
            docsTags?: Array<{ name: string; text?: string }>;
        }>;
    };
};

const TAGS = [
    ...new Set(
        kompendium.docs.components.flatMap((component) =>
            (component.docsTags ?? [])
                .filter((tag) => tag.name === 'exampleComponent' && tag.text)
                .map((tag) => (tag.text as string).trim())
        )
    ),
].sort();

// Console noise from the docs shell that is unrelated to the example under
// test. Keep this list small and documented.
const HARMLESS = [
    // The icon Cache API fails to cache icon SVGs in this environment; the icons
    // still render via a fallback.
    /Failed to execute 'add' on 'Cache'/,
    // `kompendium-app` opens a live-reload WebSocket back to the origin it was
    // served from on every route. The static test deployment has no server to
    // answer it, so the connection always fails. Anchored to the loopback origin
    // it connects to here, so a genuine WebSocket failure from an example talking
    // to some other host still surfaces instead of being swallowed.
    /WebSocket connection to 'wss?:\/\/localhost(:\d+)?\/[^']*' failed/,
];

// The docs fetch icon SVGs cross-origin from the lime-icons8 CDN. Served
// statically from localhost, those fetches depend on external network and
// occasionally fail in CI — a failed fetch has no response headers, so the
// browser reports it as both a CORS error and `net::ERR_FAILED`. Fulfil them
// locally with an empty SVG so the suite is hermetic and icon loading can't
// manufacture console errors unrelated to the example under test.
const stubExternalIcons = (page: Page): Promise<void> =>
    page.route('**/lime-icons8/**', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'image/svg+xml',
            body: '<svg xmlns="http://www.w3.org/2000/svg"/>',
        })
    );

test('the docs expose the expected number of examples', () => {
    // Guards against the metadata failing to build or the enumeration drifting,
    // either of which would silently reduce coverage to zero.
    expect(TAGS.length).toBeGreaterThan(400);
});

for (const tag of TAGS) {
    test(tag, async ({ page }) => {
        const errors: string[] = [];
        page.on('console', (message) => {
            if (message.type() === 'error') {
                errors.push(message.text());
            }
        });
        // Prefer the stack (it leads with the name and message in V8) so a
        // failure report identifies where an example threw, not just that it did.
        page.on('pageerror', (error) =>
            errors.push(error.stack ?? error.message)
        );

        await stubExternalIcons(page);
        await page.goto(`/#/debug/${tag}`);

        const example = page.locator(`.show-case_component ${tag}`).first();
        await expect(example).toBeAttached({ timeout: 15_000 });

        // The element upgrades before Stencil finishes its first (async) render,
        // and heavier examples load lazily, so poll until it has rendered content
        // rather than sampling once.
        await expect(async () => {
            const renderedSomething = await example.evaluate(
                (element) =>
                    (element.shadowRoot?.childElementCount ?? 0) > 0 ||
                    element.childElementCount > 0
            );
            expect(renderedSomething, `${tag} rendered nothing`).toBe(true);
        }).toPass({ timeout: 10_000 });

        const realErrors = errors.filter(
            (error) => !HARMLESS.some((pattern) => pattern.test(error))
        );
        expect(realErrors, `${tag} produced console errors`).toEqual([]);
    });
}
