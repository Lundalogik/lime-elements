import { test, expect, type Locator, type Page } from '@playwright/test';

// Per-component example test for limel-scroller. The scrolling logic itself is
// covered by scroller.e2e.tsx; this drives the docs examples, to check what a
// real keyboard does to them, and to pin down how they look.
//
// Coupling (intentional, fails loudly if broken — never silently):
//   1. `limel-example-scroller-horizontal` and `limel-example-scroller-vertical`
//      each hold sixteen `limel-button`s inside a `limel-scroller`;
//   2. the scroll buttons are hidden from assistive technology, so they are
//      located by where the scroller puts them.

const HORIZONTAL = 'limel-example-scroller-horizontal';
const VERTICAL = 'limel-example-scroller-vertical';

type Axis = 'horizontal' | 'vertical';

const scroller = (page: Page) => page.locator('limel-scroller');
const items = (page: Page) => scroller(page).locator('limel-button');
const endArrow = (page: Page) =>
    scroller(page).locator('div.scroll-button.end div.arrow-button');

// An arrow cannot be disabled, so whether it is of any use is up to the scroller.
const canScrollToEnd = (page: Page) =>
    scroller(page)
        .locator('div.scroller')
        .evaluate((element) => element.classList.contains('can-scroll-to-end'));

// Stencil flags a component as `hydrated` right before it runs
// `componentDidLoad`, so the scroller is listening from then on.
const open = async (page: Page, example: string) => {
    await page.goto(`/#/debug/${example}`);
    await expect(scroller(page)).toHaveClass(/hydrated/);
};

const boxOf = async (locator: Locator) => {
    const box = await locator.boundingBox();
    if (!box) {
        throw new Error('Expected the element to be rendered');
    }

    return box;
};

const positionOf = (page: Page, axis: Axis) =>
    scroller(page)
        .locator('div.scroll-area')
        .evaluate(
            (area, direction) =>
                direction === 'horizontal' ? area.scrollLeft : area.scrollTop,
            axis
        );

// Resolves once the scroll position has stopped changing, which is how a smooth
// scroll is known to be over.
const settled = async (page: Page, axis: Axis) => {
    let previous: number | undefined;
    await expect
        .poll(
            async () => {
                const position = await positionOf(page, axis);
                const unchanged = position === previous;
                previous = position;

                return unchanged;
            },
            { intervals: [150], timeout: 5000 }
        )
        .toBe(true);
};

// At an edge, an arrow dims and slides away after a delay. Once all of its
// transitions are over, it is where it is going to stay.
const settledEndArrow = (page: Page) =>
    scroller(page)
        .locator('div.scroll-button.end')
        .evaluate(async (arrow) => {
            await Promise.all(
                arrow.getAnimations().map((animation) => animation.finished)
            );
        });

const scrollByClicking = async (page: Page, axis: Axis, button: Locator) => {
    const before = await positionOf(page, axis);
    await button.click();
    await expect.poll(() => positionOf(page, axis)).not.toBe(before);
    await settled(page, axis);
};

const scrollToTheEnd = async (page: Page, axis: Axis) => {
    while (await canScrollToEnd(page)) {
        await scrollByClicking(page, axis, endArrow(page));
    }
};

const edges = (box: {
    x: number;
    y: number;
    width: number;
    height: number;
}) => ({
    horizontal: { start: box.x, end: box.x + box.width },
    vertical: { start: box.y, end: box.y + box.height },
});

test.describe('limel-scroller', () => {
    for (const [axis, example] of [
        ['horizontal', HORIZONTAL],
        ['vertical', VERTICAL],
    ] as const) {
        test(`keeps the focused item in view while tabbing through a ${axis} scroller`, async ({
            page,
        }) => {
            await open(page, example);
            const count = await items(page).count();
            await items(page).first().getByRole('button').focus();

            for (let index = 1; index < count; index++) {
                await page.keyboard.press('Tab');
                const current = items(page).nth(index);
                await expect(current.getByRole('button')).toBeFocused();
                await settled(page, axis);

                const area = edges(
                    await boxOf(scroller(page).locator('div.scroll-area'))
                )[axis];
                const item = edges(await boxOf(current))[axis];
                expect(item.start).toBeGreaterThanOrEqual(area.start - 1);
                expect(item.end).toBeLessThanOrEqual(area.end + 1);

                if (index === count - 1) {
                    continue;
                }

                const next = edges(await boxOf(items(page).nth(index + 1)))[
                    axis
                ];
                expect(next.start).toBeLessThan(area.end);
            }
        });
    }

    for (const [axis, example] of [
        ['horizontal', HORIZONTAL],
        ['vertical', VERTICAL],
    ] as const) {
        test(`hides the arrows of a ${axis} scroller from screen readers, and leaves nothing in them to focus`, async ({
            page,
        }) => {
            await open(page, example);
            const arrows = scroller(page).locator('div.scroll-button');

            await expect(arrows).toHaveCount(2);
            const all = await arrows.all();
            for (const arrow of all) {
                await expect(arrow).toHaveAttribute('aria-hidden', 'true');
                await expect(
                    arrow.locator(
                        'button, a[href], input, select, textarea, [tabindex], [role]'
                    )
                ).toHaveCount(0);
            }
        });
    }

    for (const [axis, example] of [
        ['horizontal', HORIZONTAL],
        ['vertical', VERTICAL],
    ] as const) {
        test(`keeps the arrow of a ${axis} scroller under the pointer, when the end is reached`, async ({
            page,
        }) => {
            await open(page, example);
            await expect.poll(() => canScrollToEnd(page)).toBe(true);
            await settledEndArrow(page);
            const arrow = scroller(page).locator('div.scroll-button.end');
            const before = await boxOf(arrow);

            await scrollToTheEnd(page, axis);
            await settledEndArrow(page);

            expect(await boxOf(arrow)).toEqual(before);
        });
    }

    test('keeps the focus where it was, when an arrow is clicked', async ({
        page,
    }) => {
        await open(page, HORIZONTAL);
        const focused = items(page).nth(2).getByRole('button');
        await focused.focus();
        await expect.poll(() => canScrollToEnd(page)).toBe(true);

        await endArrow(page).click();

        await expect(focused).toBeFocused();
    });

    test('scrolls without animating, when the user prefers reduced motion', async ({
        page,
    }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await open(page, HORIZONTAL);
        await endArrow(page).click();
        const immediately = await positionOf(page, 'horizontal');

        await settled(page, 'horizontal');
        expect(immediately).toBeGreaterThan(0);
        expect(await positionOf(page, 'horizontal')).toBe(immediately);
    });

    test.describe('visual baselines', () => {
        // Pixel comparison only runs in the pinned Playwright Docker image
        // (locally via scripts/visual-tests-docker.sh, in CI via container:),
        // because macOS and Linux render fonts and anti-aliasing differently.
        test.skip(
            !process.env.RUN_VISUAL_SNAPSHOTS,
            'visual snapshots only run in the pinned Docker/CI environment'
        );

        for (const [axis, example] of [
            ['horizontal', HORIZONTAL],
            ['vertical', VERTICAL],
        ] as const) {
            test(`${axis}, at the start`, async ({ page }) => {
                await open(page, example);
                await expect.poll(() => canScrollToEnd(page)).toBe(true);

                await expect(scroller(page)).toHaveScreenshot(
                    `scroller-${axis}-start.png`
                );
            });

            test(`${axis}, scrolled once`, async ({ page }) => {
                await open(page, example);
                await scrollByClicking(page, axis, endArrow(page));
                await page.mouse.move(0, 0);

                await expect(scroller(page)).toHaveScreenshot(
                    `scroller-${axis}-middle.png`
                );
            });

            test(`${axis}, scrolled to the end`, async ({ page }) => {
                await open(page, example);
                await scrollToTheEnd(page, axis);
                await page.mouse.move(0, 0);

                await expect(scroller(page)).toHaveScreenshot(
                    `scroller-${axis}-end.png`
                );
            });
        }
    });
});
