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

// Map of component tag -> axe rule ids it is currently known to violate.
//
// The baseline is keyed by the COMPONENT that causes a violation, not by the
// example that exposed it: each violating node is attributed to its nearest
// enclosing `limel-*` component (walking up through shadow roots), falling back
// to the example's own tag for nodes in the example's own markup. This way a
// new example that demonstrates a component with already-accepted debt does not
// fail the gate — only genuinely new (component, rule) pairs do.
//
// Regenerate after fixing violations with:
//   npm run test:examples:accessibility:update
// Regeneration must be a FULL run: a component's debt is only observable
// through the examples that exercise it, so a partial run cannot prove a
// (component, rule) pair is gone. Regeneration only ratchets DOWN: it removes
// pairs that are no longer violated anywhere but never adds new ones, so the
// baseline can only shrink over time. A genuinely new violation therefore can't
// be silently accepted by rerunning the script — it must be fixed (or,
// deliberately, added to this file by hand). The exception is bootstrapping: if
// no baseline file exists yet, a full snapshot is written.
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

// (component-or-example tag) -> rule ids observed during an update run.
const observed = new Map<string, Set<string>>();
let scannedExamples = 0;

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
    // With component-keyed entries, removing a (component, rule) pair is only
    // sound if no example anywhere still shows it — which requires having
    // scanned every example. Refuse to write from an incomplete run (a test
    // filter, or examples that errored out before being recorded).
    if (scannedExamples !== TAGS.length) {
        throw new Error(
            `Refusing to write ${BASELINE_PATH}: only ${scannedExamples} of ` +
                `${TAGS.length} examples were scanned. Regeneration must be a ` +
                `full, green run of the accessibility suite.`
        );
    }
    // Ratchet: keep only the (component, rule) pairs that are still observed
    // AND were already baselined. Fixed pairs drop out; new ones are never
    // added. With no baseline yet, bootstrap from the full observations.
    const result: Baseline = {};
    for (const key of [...observed.keys()].sort()) {
        const rules = [...(observed.get(key) ?? [])].sort();
        const kept = BASELINE_EXISTED
            ? rules.filter((rule) => (baseline[key] ?? []).includes(rule))
            : rules;
        if (kept.length > 0) {
            result[key] = kept;
        }
    }
    writeFileSync(BASELINE_PATH, `${JSON.stringify(result, null, 4)}\n`);
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
            type AxeNode = {
                target: string[];
                failureSummary?: string;
                element?: Element;
            };
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

            // Attribute a violating node to its nearest enclosing `limel-*`
            // component, walking up through shadow roots; nodes that sit in the
            // example's own markup (outside any component) yield null and are
            // keyed on the example tag instead.
            const componentOf = (
                node: Element | null = null
            ): string | null => {
                let element = node;
                while (element && element !== exampleHost) {
                    if (
                        element.tagName.startsWith('LIMEL-') &&
                        !isScaffolding(element)
                    ) {
                        return element.tagName.toLowerCase();
                    }
                    const rootNode: Node = element.getRootNode();
                    element =
                        element.parentElement ??
                        (rootNode instanceof ShadowRoot ? rootNode.host : null);
                }
                return null;
            };

            const context =
                exclude.length > 0 ? { include, exclude } : { include };
            const result = await axe.run(context, {
                resultTypes: ['violations'],
                // Gives us `node.element` so attribution can walk real DOM
                // nodes instead of parsing axe's selector strings.
                elementRef: true,
            });
            // One entry per rule id, keeping each offending node's target,
            // summary and attributed component, so a failure report says which
            // component broke the rule, on which element, and why.
            const byId = new Map<
                string,
                {
                    id: string;
                    nodes: Array<{
                        target: string[];
                        failureSummary?: string;
                        component: string | null;
                    }>;
                }
            >();
            for (const violation of result.violations) {
                const entry = byId.get(violation.id) ?? {
                    id: violation.id,
                    nodes: [],
                };
                for (const node of violation.nodes) {
                    entry.nodes.push({
                        target: node.target,
                        failureSummary: node.failureSummary,
                        component: componentOf(node.element ?? null),
                    });
                }
                byId.set(violation.id, entry);
            }
            return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
        }, host);

        if (UPDATE_BASELINE) {
            for (const violation of violations) {
                for (const node of violation.nodes) {
                    const key = node.component ?? tag;
                    const rules = observed.get(key) ?? new Set<string>();
                    rules.add(violation.id);
                    observed.set(key, rules);
                }
            }
            scannedExamples++;
            return;
        }

        // A node is tolerated if its (component-or-example, rule) pair is
        // baselined; anything else is a new violation.
        const newViolations = violations.flatMap((violation) =>
            violation.nodes
                .map((node) => ({ ...node, rule: violation.id }))
                .filter(
                    (node) =>
                        !(baseline[node.component ?? tag] ?? []).includes(
                            node.rule
                        )
                )
        );
        const describe = (node: (typeof newViolations)[number]): string =>
            `  ${node.component ?? tag} → ${node.rule}\n` +
            `    at ${node.target.join(' ')}\n` +
            `      ${(node.failureSummary ?? '').replaceAll('\n', '\n      ')}`;
        expect(
            newViolations.map(
                (node) => `${node.component ?? tag}: ${node.rule}`
            ),
            `${tag} has accessibility violations that are not in the baseline:\n` +
                `${newViolations.map(describe).join('\n')}\n` +
                `Fix them in the component, or — for deliberately accepted ` +
                `debt — add the (component, rule) entry to the baseline by ` +
                `hand. The baseline only ratchets down, so it cannot be ` +
                `regenerated to accept new violations.`
        ).toEqual([]);
    });
}
