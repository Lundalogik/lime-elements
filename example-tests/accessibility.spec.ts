import { test, expect } from '@playwright/test';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// We run axe by injecting its source and calling `axe.run` ourselves rather
// than via `@axe-core/playwright`, because we need to scope the scan to a set of
// DOM nodes deep inside nested shadow roots — which the wrapper's selector-based
// scoping does not handle.
const AXE_SOURCE = readFileSync(
    path.resolve(process.cwd(), 'node_modules', 'axe-core', 'axe.min.js'),
    'utf8'
);

// Map of example tag -> axe rule ids it is currently known to violate. The test
// fails only when an example violates a rule NOT in its baseline, so changes
// cannot introduce new accessibility regressions while the existing debt is
// worked down.
//
// Regenerate after fixing violations with:
//   UPDATE_AXE_BASELINE=1 npx playwright test --config playwright.example-tests.config.ts accessibility
// Regeneration only ratchets DOWN: it removes rules that are no longer violated
// but never adds new ones, so the baseline can only shrink over time. A genuinely
// new violation therefore can't be silently accepted by rerunning the script —
// it must be fixed (or, deliberately, added to this file by hand). The exception
// is bootstrapping: if no baseline file exists yet, a full snapshot is written.
const BASELINE_PATH = path.resolve(
    process.cwd(),
    'example-tests',
    'axe-baseline.json'
);
const UPDATE_BASELINE = Boolean(process.env.UPDATE_AXE_BASELINE);

type Baseline = Record<string, string[]>;

const parseBaseline = (raw: string): Baseline => {
    try {
        return JSON.parse(raw) as Baseline;
    } catch (error) {
        throw new Error(
            `${BASELINE_PATH} is corrupt and could not be parsed ` +
                `(${(error as Error).message}). Delete or repair the file ` +
                `first; then, to bootstrap a fresh baseline, rerun with ` +
                `UPDATE_AXE_BASELINE=1.`
        );
    }
};

const BASELINE_EXISTED = existsSync(BASELINE_PATH);
const baseline: Baseline = BASELINE_EXISTED
    ? parseBaseline(readFileSync(BASELINE_PATH, 'utf8'))
    : {};

const generated: Baseline = {};

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

// The `afterAll` writer below assumes it is the sole writer. `resolveWorkers()`
// forces a single worker in update mode, but a `--workers` CLI override beats the
// config — so fail loudly rather than let parallel workers each write a partial
// baseline and clobber the file.
test.beforeAll(() => {
    if (UPDATE_BASELINE && test.info().config.workers !== 1) {
        throw new Error(
            'UPDATE_AXE_BASELINE requires a single worker so the baseline is ' +
                'written exactly once. Remove the --workers override.'
        );
    }
});

test.afterAll(() => {
    if (!UPDATE_BASELINE) {
        return;
    }
    // Start from the existing baseline so examples not scanned in this run are
    // preserved, then ratchet each scanned example: keep only the rules that are
    // still violated AND were already baselined. Fixed rules drop out; new ones
    // are never added. With no baseline yet, bootstrap from the full results.
    const result: Baseline = { ...baseline };
    for (const tag of Object.keys(generated)) {
        const stillViolated = generated[tag];
        const kept = BASELINE_EXISTED
            ? stillViolated.filter((rule) =>
                  (baseline[tag] ?? []).includes(rule)
              )
            : stillViolated;
        if (kept.length > 0) {
            result[tag] = kept;
        } else {
            delete result[tag];
        }
    }
    const sorted: Baseline = {};
    for (const tag of Object.keys(result).sort()) {
        sorted[tag] = result[tag];
    }
    writeFileSync(BASELINE_PATH, `${JSON.stringify(sorted, null, 4)}\n`);
});

test('the docs expose the expected number of examples', () => {
    // Guards against the metadata failing to build or the enumeration drifting,
    // either of which would silently reduce coverage to zero.
    expect(TAGS.length).toBeGreaterThan(400);
});

for (const tag of TAGS) {
    test(tag, async ({ page }) => {
        await page.goto(`/#/debug/${tag}`);

        const example = page.locator(`.show-case_component ${tag}`).first();
        await expect(example).toBeAttached({ timeout: 15_000 });
        await expect(async () => {
            const rendered = await example.evaluate(
                (element) =>
                    (element.shadowRoot?.childElementCount ?? 0) > 0 ||
                    element.childElementCount > 0
            );
            expect(rendered).toBe(true);
        }).toPass({ timeout: 10_000 });

        // Let async content (data fetches, editors, tables) finish rendering
        // before scanning, so the violations are the settled ones rather than a
        // transient mid-render state.
        // Best-effort: some examples poll or hold a socket open, so networkidle
        // may never arrive. Swallow the timeout and scan anyway rather than turn
        // this into a hard wait that would hang those examples.
        await page
            .waitForLoadState('networkidle', { timeout: 5000 })
            .catch(() => undefined);
        await example.evaluate(
            () =>
                new Promise((resolve) =>
                    requestAnimationFrame(() =>
                        requestAnimationFrame(() => resolve(null))
                    )
                )
        );

        const host = await example.elementHandle();
        expect(host, `${tag} example element not found`).not.toBeNull();

        await page.addScriptTag({ content: AXE_SOURCE });
        const violations = await page.evaluate(async (exampleHost) => {
            type AxeNode = { target: string[]; failureSummary?: string };
            type AxeRunner = {
                run: (
                    context: unknown,
                    options?: unknown
                ) => Promise<{
                    violations: Array<{ id: string; nodes: AxeNode[] }>;
                }>;
            };
            const axe = (window as Window & { axe: AxeRunner }).axe;

            const root = exampleHost.shadowRoot ?? exampleHost;
            // No production component's tag starts with `limel-example-`; the
            // prefix is exclusive to the scaffolding helpers, so this cleanly
            // separates the demo plumbing from the components under test.
            const isScaffolding = (element: Element) =>
                element.tagName.startsWith('LIMEL-EXAMPLE-');

            // Test the production components the example demonstrates: its
            // top-level non-scaffolding children, with every `limel-example-*`
            // helper (controls, value, event printer, ...) excluded wherever it
            // appears in the subtree.
            const include = [...root.children].filter(
                (element) => !isScaffolding(element)
            );
            const exclude = [...root.querySelectorAll('*')].filter(
                isScaffolding
            );
            if (include.length === 0) {
                return [];
            }

            const context =
                exclude.length > 0 ? { include, exclude } : { include };
            const result = await axe.run(context, {
                resultTypes: ['violations'],
            });
            // One entry per rule id, keeping the offending nodes' targets and
            // summaries so a failure report says which element broke the rule and
            // why — not just the rule id. The baseline compares ids only.
            const byId = new Map<string, { id: string; nodes: AxeNode[] }>();
            for (const violation of result.violations) {
                if (!byId.has(violation.id)) {
                    byId.set(violation.id, {
                        id: violation.id,
                        nodes: violation.nodes.map((node) => ({
                            target: node.target,
                            failureSummary: node.failureSummary,
                        })),
                    });
                }
            }
            return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
        }, host);

        const violatedRules = violations.map((violation) => violation.id);

        if (UPDATE_BASELINE) {
            generated[tag] = violatedRules;
            return;
        }

        const allowed = new Set(baseline[tag] ?? []);
        const newViolations = violations.filter(
            (violation) => !allowed.has(violation.id)
        );
        const describe = (violation: (typeof violations)[number]): string =>
            `  ${violation.id}\n` +
            violation.nodes
                .map(
                    (node) =>
                        `    at ${node.target.join(' ')}\n` +
                        `      ${(node.failureSummary ?? '').replaceAll('\n', '\n      ')}`
                )
                .join('\n');
        expect(
            newViolations.map((violation) => violation.id),
            `${tag} has accessibility violations that are not in the baseline:\n` +
                `${newViolations.map(describe).join('\n')}\n` +
                `Please fix them. The baseline only ratchets down, so it cannot ` +
                `be regenerated to accept new violations.`
        ).toEqual([]);
    });
}
