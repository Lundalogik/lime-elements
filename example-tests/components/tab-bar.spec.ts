import { test, expect, type Locator, type Page } from '@playwright/test';

// Per-component example test for limel-tab-bar. It pins down what a consumer
// can see and feel — activation, keyboard navigation, the tab order, and how the
// bar scrolls when the tabs do not fit — plus visual baselines, so the internals
// can be replaced without any of it changing.
//
// Coupling (intentional, fails loudly if broken — never silently):
//   1. `limel-example-tab-bar-basic` has the eight tabs in `BASIC_TABS` and
//      reflects the last activated one in a `limel-example-value`;
//   2. the dynamic-width and equal-width examples have three tabs (Cats, Dogs,
//      Birds);
//   3. `limel-example-tab-bar-vertical` has more tabs than fit in its height,
//      the first two of them Joker and Parasite, and the last one Inception;
//   4. the scroll buttons are hidden from assistive technology, so they are
//      located by where the scroller puts them.

const BASIC = 'limel-example-tab-bar-basic';
const DYNAMIC_WIDTH = 'limel-example-tab-bar-with-dynamic-tab-width';
const EQUAL_WIDTH = 'limel-example-tab-bar-with-equal-tab-width';
const VERTICAL = 'limel-example-tab-bar-vertical';
const TAB_WIDTH = 'limel-example-tab-bar-tab-width';

const BASIC_TABS = [
    'Joker',
    'Parasite',
    'Harriet',
    'Bombshell',
    'Judy',
    'Friends',
    'Little Women',
    'Inception',
];

const PLACEHOLDER_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>';

// Narrow enough that the eight tabs of the basic example take more than one
// page to scroll through.
const VIEWPORT = { width: 520, height: 480 };
test.use({ viewport: VIEWPORT });

type Span = { x: number; width: number };
type Direction = 'start' | 'end';

const tabBar = (page: Page) => page.locator('limel-tab-bar');
const tabs = (page: Page) => tabBar(page).getByRole('tab');
const tab = (page: Page, name: string) =>
    tabBar(page).getByRole('tab', { name: new RegExp(`^${name}`) });
const scrollButton = (page: Page, direction: Direction) =>
    tabBar(page).locator(`div.scroll-button.${direction} div.arrow-button`);

// An arrow cannot be disabled, so whether it is of any use is up to the
// scroller, which marks the directions that there is more to scroll to.
const canScroll = (page: Page, direction: Direction) =>
    tabBar(page)
        .locator('div.scroller')
        .evaluate(
            (element, side) =>
                element.classList.contains(`can-scroll-to-${side}`),
            direction
        );

const expectCanScroll = (page: Page, direction: Direction, expected: boolean) =>
    expect
        .poll(() => canScroll(page, direction), {
            message: `Expected the tab bar to ${expected ? '' : 'not '}offer scrolling towards the ${direction}`,
        })
        .toBe(expected);

// At an edge, an arrow dims and slides away after a delay. Once all of its
// transitions are over, it is where it is going to stay.
const settledEndArrow = (page: Page) =>
    tabBar(page)
        .locator('div.scroll-button.end')
        .evaluate(async (arrow) => {
            await Promise.all(
                arrow.getAnimations().map((animation) => animation.finished)
            );
        });

// Stencil flags a component as `hydrated` right before it runs
// `componentDidLoad`, where the tab bar starts listening. A click before then
// would be lost.
const open = async (page: Page, example: string) => {
    await page.goto(`/#/debug/${example}`);
    await expect(tabBar(page)).toHaveClass(/hydrated/);
};

const boxOf = async (locator: Locator) => {
    const box = await locator.boundingBox();
    if (!box) {
        throw new Error(`Expected ${locator} to be rendered`);
    }

    return box;
};

const leftOf = async (locator: Locator) => {
    const { x } = await boxOf(locator);

    return x;
};

// Where the element is, along both axes, to see whether it has moved.
const positionOf = async (locator: Locator) => {
    const { x, y } = await boxOf(locator);

    return `${x},${y}`;
};

const boxesOf = async (locator: Locator) => {
    const all = await locator.all();

    return Promise.all(all.map((item) => boxOf(item)));
};

const overlap = (a: Span, b: Span) =>
    Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);

const tabsWithin = (boxes: Span[], region: Span) =>
    boxes
        .map((box, index) => ({ box, index }))
        .filter(({ box }) => overlap(box, region) > 0);

// Resolves once the element has stopped moving, which is how a smooth scroll is
// known to be over.
const settled = async (locator: Locator) => {
    let previous: string | undefined;
    await expect
        .poll(
            async () => {
                const position = await positionOf(locator);
                const unchanged = position === previous;
                previous = position;

                return unchanged;
            },
            {
                message: `Expected ${locator} to stop moving`,
                intervals: [150],
                timeout: 5000,
            }
        )
        .toBe(true);
};

// Clicks a scroll button and waits for the scroll it starts to finish.
const scrollByClicking = async (page: Page, button: Locator) => {
    const first = tabs(page).first();
    const before = await positionOf(first);
    await button.click();
    await expect.poll(() => positionOf(first)).not.toBe(before);
    await settled(first);
};

const scrollToTheEnd = async (page: Page) => {
    const next = scrollButton(page, 'end');
    await expectCanScroll(page, 'end', true);

    while (await canScroll(page, 'end')) {
        await scrollByClicking(page, next);
    }
};

// Moving to a tab with the keyboard activates it: it has focus, is selected, and
// is reported to the consumer.
const expectActive = async (page: Page, name: string) => {
    await expect(tab(page, name)).toBeFocused();
    await expect(tab(page, name)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('limel-example-value')).toContainText(name);
};

const expectEntirelyIn = (box: Span, bar: Span, name: string) => {
    expect(box.x, `left edge of ${name}`).toBeGreaterThanOrEqual(bar.x - 1);
    expect(box.x + box.width, `right edge of ${name}`).toBeLessThanOrEqual(
        bar.x + bar.width + 1
    );
};

// Waits for the scrolling to stop, and expects the tab to be entirely in view,
// with the neighbour that lies in the direction of travel peeking in.
const expectRevealed = async (page: Page, index: number, neighbour: number) => {
    const current = tabs(page).nth(index);
    await settled(current);

    const bar = await boxOf(tabBar(page));
    const box = await boxOf(current);
    const name = BASIC_TABS[index];
    expectEntirelyIn(box, bar, name);

    if (neighbour < 0 || neighbour >= BASIC_TABS.length) {
        return;
    }

    const peeking = await boxOf(tabs(page).nth(neighbour));
    expect(
        overlap(peeking, bar),
        `${BASIC_TABS[neighbour]}, next to ${name}`
    ).toBeGreaterThan(0);
};

// The tab that has keyboard focus gets the focus shadow, on the part that holds
// its icon, text and badge, so that the shadow stays inside the tab's edges.
const expectFocusShadow = (page: Page, name: string, expected: boolean) => {
    const content = tab(page, name).locator('span.content');
    if (expected) {
        return expect(content).not.toHaveCSS('box-shadow', 'none');
    }

    return expect(content).toHaveCSS('box-shadow', 'none');
};

// Gives the tests somewhere to tab out to, and back from.
const addFocusableNeighbours = (page: Page, example: string) =>
    page.locator(example).evaluate((host) => {
        const create = (id: string) => {
            const button = host.ownerDocument.createElement('button');
            button.id = id;
            button.textContent = id;

            return button;
        };

        host.before(create('before'));
        host.after(create('after'));
    });

test.describe('limel-tab-bar', () => {
    test.describe('activation', () => {
        test.beforeEach(async ({ page }) => {
            await open(page, BASIC);
        });

        test('activates a tab on click and reports it to the consumer', async ({
            page,
        }) => {
            await tab(page, 'Parasite').click();

            await expect(page.locator('limel-example-value')).toContainText(
                'Parasite'
            );
            await expect(tab(page, 'Parasite')).toHaveAttribute(
                'aria-selected',
                'true'
            );
            await expect(tab(page, 'Joker')).toHaveAttribute(
                'aria-selected',
                'false'
            );
        });

        test('moves focus and selection with the arrow, Home and End keys', async ({
            page,
        }) => {
            await tab(page, 'Joker').focus();

            await page.keyboard.press('ArrowRight');
            await expectActive(page, 'Parasite');

            await page.keyboard.press('ArrowLeft');
            await expectActive(page, 'Joker');

            await page.keyboard.press('End');
            await expectActive(page, 'Inception');

            await page.keyboard.press('Home');
            await expectActive(page, 'Joker');
        });

        test('wraps around at both ends', async ({ page }) => {
            await tab(page, 'Joker').focus();

            await page.keyboard.press('ArrowLeft');
            await expectActive(page, 'Inception');

            await page.keyboard.press('ArrowRight');
            await expectActive(page, 'Joker');
        });

        test('leaves a key that is pressed with Alt to the browser', async ({
            page,
        }) => {
            await tab(page, 'Joker').focus();

            // Alt and the right arrow go forward in a browser. The key that
            // follows is there to show that the first one did not move a tab.
            await page.keyboard.press('Alt+ArrowRight');
            await page.keyboard.press('ArrowRight');

            await expectActive(page, 'Parasite');
        });

        test('keeps only the active tab in the tab order, and tabs back in to it', async ({
            page,
        }) => {
            await addFocusableNeighbours(page, BASIC);
            await tab(page, 'Harriet').click();

            await expect(tab(page, 'Harriet')).toHaveAttribute('tabindex', '0');
            await expect(tab(page, 'Joker')).toHaveAttribute('tabindex', '-1');

            await page.keyboard.press('Tab');
            await expect(page.locator('#after')).toBeFocused();

            await page.keyboard.press('Shift+Tab');
            await expect(tab(page, 'Harriet')).toBeFocused();
        });

        test('puts the first tab in the tab order when no tab is selected, so that the keyboard reaches the bar', async ({
            page,
        }) => {
            await addFocusableNeighbours(page, BASIC);
            await tabBar(page).evaluate((bar) => {
                const element = bar as unknown as {
                    tabs: Array<{ active?: boolean }>;
                };
                element.tabs = element.tabs.map((tab) => ({
                    ...tab,
                    active: false,
                }));
            });
            await expect(tab(page, 'Joker')).toHaveAttribute('tabindex', '0');
            await expect(tab(page, 'Parasite')).toHaveAttribute(
                'tabindex',
                '-1'
            );

            await page.locator('#before').focus();
            await page.keyboard.press('Tab');
            await expect(tab(page, 'Joker')).toBeFocused();

            await page.keyboard.press('ArrowRight');
            await expectActive(page, 'Parasite');
        });
    });

    test.describe('when the tabs do not fit', () => {
        test.beforeEach(async ({ page }) => {
            await open(page, BASIC);
            await expect(tabs(page)).toHaveCount(BASIC_TABS.length);
        });

        test('offers to scroll only towards what is hidden', async ({
            page,
        }) => {
            // Nothing is marked before the bar has worked out which way there is
            // more to see, so the end goes first: once it is marked, the start
            // not being marked means something.
            await expectCanScroll(page, 'end', true);
            await expectCanScroll(page, 'start', false);
        });

        test('scrolls nearly a page, keeping the tail of the previous page in view', async ({
            page,
        }) => {
            await expectCanScroll(page, 'end', true);
            const bar = await boxOf(tabBar(page));
            const tabsBefore = await boxesOf(tabs(page));
            const tail = tabsWithin(tabsBefore, {
                x: bar.x + bar.width * 0.8,
                width: bar.width * 0.2,
            });

            await scrollByClicking(page, scrollButton(page, 'end'));

            const tabsAfter = await boxesOf(tabs(page));
            const scrolled = tabsBefore[0].x - tabsAfter[0].x;
            expect(scrolled, 'how far one click scrolled').toBeGreaterThan(
                bar.width * 0.6
            );
            expect(scrolled, 'how far one click scrolled').toBeLessThan(
                bar.width
            );
            expect(tail.length, 'tabs in the tail of the page').toBeGreaterThan(
                0
            );
            for (const { index } of tail) {
                expect(
                    overlap(tabsAfter[index], bar),
                    `${BASIC_TABS[index]}, which was in the tail of the page`
                ).toBeGreaterThan(0);
            }
        });

        test('scrolls nearly a page back, keeping the head of the previous page in view', async ({
            page,
        }) => {
            await scrollToTheEnd(page);
            const bar = await boxOf(tabBar(page));
            const tabsBefore = await boxesOf(tabs(page));
            const head = tabsWithin(tabsBefore, {
                x: bar.x,
                width: bar.width * 0.2,
            });

            await scrollByClicking(page, scrollButton(page, 'start'));

            const tabsAfter = await boxesOf(tabs(page));
            const scrolled = tabsAfter[0].x - tabsBefore[0].x;
            expect(scrolled, 'how far one click scrolled').toBeGreaterThan(
                bar.width * 0.6
            );
            expect(scrolled, 'how far one click scrolled').toBeLessThan(
                bar.width
            );
            expect(head.length, 'tabs in the head of the page').toBeGreaterThan(
                0
            );
            for (const { index } of head) {
                expect(
                    overlap(tabsAfter[index], bar),
                    `${BASIC_TABS[index]}, which was in the head of the page`
                ).toBeGreaterThan(0);
            }
        });

        test('reaches the last tab, and from there only offers to scroll back', async ({
            page,
        }) => {
            await scrollToTheEnd(page);

            const bar = await boxOf(tabBar(page));
            const last = await boxOf(tabs(page).last());
            expect(
                overlap(last, bar),
                'how much of the last tab is in view'
            ).toBeGreaterThan(last.width / 2);
            await expectCanScroll(page, 'start', true);
            await expectCanScroll(page, 'end', false);
        });

        test('gets back to the first tab, and from there only offers to scroll forward', async ({
            page,
        }) => {
            await scrollToTheEnd(page);
            const previous = scrollButton(page, 'start');
            await expectCanScroll(page, 'start', true);

            while (await canScroll(page, 'start')) {
                await scrollByClicking(page, previous);
            }

            const bar = await boxOf(tabBar(page));
            const first = await boxOf(tabs(page).first());
            expect(
                overlap(first, bar),
                'how much of the first tab is in view'
            ).toBeGreaterThan(first.width / 2);
            await expectCanScroll(page, 'end', true);
            await expectCanScroll(page, 'start', false);
        });

        test('follows the size of the bar, not only of the window', async ({
            page,
        }) => {
            await expectCanScroll(page, 'end', true);

            await tabBar(page).evaluate((bar) => {
                bar.style.width = '120rem';
            });
            await expectCanScroll(page, 'end', false);

            await tabBar(page).evaluate((bar) => {
                bar.style.width = '';
            });
            await expectCanScroll(page, 'end', true);
        });

        test('reveals the active tab of a bar that renders with it far away', async ({
            page,
        }) => {
            await tabBar(page).evaluate((bar) => {
                const host = bar.ownerDocument.createElement('div');
                host.style.cssText =
                    'position: fixed; top: 12rem; left: 1rem; width: 22rem';
                const fresh = bar.ownerDocument.createElement('limel-tab-bar');
                fresh.id = 'fresh';
                (fresh as unknown as { tabs: unknown }).tabs = Array.from(
                    { length: 10 },
                    (_, index) => ({
                        id: index,
                        text: `Tab number ${index + 1}`,
                        active: index === 8,
                    })
                );
                host.append(fresh);
                bar.ownerDocument.body.append(host);
            });
            const fresh = page.locator('limel-tab-bar#fresh');
            await expect(fresh).toHaveClass(/hydrated/);
            const active = fresh.getByRole('tab', { selected: true });

            await settled(active);

            expectEntirelyIn(
                await boxOf(active),
                await boxOf(fresh),
                'the active tab'
            );
        });

        test('reveals the active tab when it is set through `tabs`', async ({
            page,
        }) => {
            await tabBar(page).evaluate((bar) => {
                const element = bar as unknown as {
                    tabs: Array<{ active?: boolean }>;
                };
                element.tabs = element.tabs.map((tab, index, all) => ({
                    ...tab,
                    active: index === all.length - 1,
                }));
            });
            const last = tab(page, 'Inception');
            await expect(last).toHaveAttribute('aria-selected', 'true');

            await settled(last);

            expectEntirelyIn(
                await boxOf(last),
                await boxOf(tabBar(page)),
                'Inception'
            );
        });

        test('does not activate the last tab, when the arrow that scrolled to it is clicked again', async ({
            page,
        }) => {
            await expectCanScroll(page, 'end', true);
            await settledEndArrow(page);
            const arrow = await boxOf(scrollButton(page, 'end'));

            await scrollToTheEnd(page);
            await settledEndArrow(page);

            // The pointer is still on the arrow. Where the arrow overlaps the last
            // tab is where a click lands, if the arrow has slid away.
            await page.mouse.click(
                arrow.x + arrow.width / 4,
                arrow.y + arrow.height / 2
            );

            await expect(tab(page, 'Joker')).toHaveAttribute(
                'aria-selected',
                'true'
            );
            await expect(tab(page, 'Inception')).toHaveAttribute(
                'aria-selected',
                'false'
            );
        });

        test('scrolls by hand, with a wheel, trackpad or swipe, and the buttons follow', async ({
            page,
        }) => {
            const first = tabs(page).first();
            const before = await leftOf(first);

            // A wheel scrolls the same native way as a trackpad or a swipe does.
            await tabBar(page).hover();
            await page.mouse.wheel(300, 0);

            await expect
                .poll(() => leftOf(first), {
                    message: 'where the first tab ended up after the wheel',
                })
                .toBeLessThan(before - 100);
            await settled(first);
            await expectCanScroll(page, 'start', true);

            await page.mouse.wheel(-300, 0);

            await expect
                .poll(() => leftOf(first), {
                    message:
                        'where the first tab ended up after the wheel back',
                })
                .toBeCloseTo(before, 0);
            await expectCanScroll(page, 'start', false);
        });

        test('keeps the active tab in view, with a glimpse of the next one', async ({
            page,
        }) => {
            await tab(page, 'Joker').focus();

            for (let index = 1; index < BASIC_TABS.length; index++) {
                await page.keyboard.press('ArrowRight');
                await expect(tabs(page).nth(index)).toBeFocused();
                await expectRevealed(page, index, index + 1);
            }
        });

        test('keeps the active tab in view, with a glimpse of the previous one', async ({
            page,
        }) => {
            await tab(page, 'Joker').focus();
            await page.keyboard.press('End');
            await expectActive(page, 'Inception');
            await expectRevealed(
                page,
                BASIC_TABS.length - 1,
                BASIC_TABS.length
            );

            for (let index = BASIC_TABS.length - 2; index >= 0; index--) {
                await page.keyboard.press('ArrowLeft');
                await expect(tabs(page).nth(index)).toBeFocused();
                await expectRevealed(page, index, index - 1);
            }
        });

        test('reveals a tab that is cut off when it is clicked, with a glimpse of the next one', async ({
            page,
        }) => {
            const bar = await boxOf(tabBar(page));
            const barEnd = bar.x + bar.width;
            const boxes = await boxesOf(tabs(page));
            const index = boxes.findIndex(
                (box) => box.x < barEnd && box.x + box.width > barEnd
            );
            expect(
                index,
                'the index of a tab that is cut off at the end of the bar'
            ).toBeGreaterThan(-1);
            const cutOff = boxes[index];
            expect(
                barEnd - cutOff.x,
                `how much of ${BASIC_TABS[index]} is in view`
            ).toBeGreaterThan(40);

            // Clicks the part that is in view, clear of the arrow over the end of
            // the bar, without letting the test scroll the tab into view first.
            await page.mouse.click(cutOff.x + 10, cutOff.y + cutOff.height / 2);

            await expect(tabs(page).nth(index)).toHaveAttribute(
                'aria-selected',
                'true'
            );
            await expectRevealed(page, index, index + 1);
        });
    });

    test.describe('for assistive technologies and the keyboard', () => {
        test.beforeEach(async ({ page }) => {
            await open(page, BASIC);
        });

        test('hides the scroll arrows from screen readers, and leaves nothing in them to focus', async ({
            page,
        }) => {
            const arrows = tabBar(page).locator('div.scroll-button');

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

        test('keeps the focus on the active tab, when a scroll arrow is clicked', async ({
            page,
        }) => {
            await tab(page, 'Harriet').click();
            await expect(tab(page, 'Harriet')).toBeFocused();
            await expectCanScroll(page, 'end', true);

            await scrollByClicking(page, scrollButton(page, 'end'));

            await expect(tab(page, 'Harriet')).toBeFocused();
        });
    });

    test.describe('the focus shadow', () => {
        test('shows which tab has keyboard focus', async ({ page }) => {
            await open(page, BASIC);
            await addFocusableNeighbours(page, BASIC);
            await page.locator('#before').focus();
            await page.keyboard.press('Tab');
            await expect(tab(page, 'Joker')).toBeFocused();
            await expectFocusShadow(page, 'Joker', true);

            await page.keyboard.press('ArrowRight');
            await expectActive(page, 'Parasite');
            await expectFocusShadow(page, 'Parasite', true);
            await expectFocusShadow(page, 'Joker', false);
        });

        test('is not shown on a tab that is clicked', async ({ page }) => {
            await open(page, BASIC);
            await tab(page, 'Parasite').click();
            await expect(tab(page, 'Parasite')).toBeFocused();

            await expectFocusShadow(page, 'Parasite', false);
        });

        for (const example of [DYNAMIC_WIDTH, EQUAL_WIDTH]) {
            test(`keeps the same distance to every edge of the tab, in ${example}`, async ({
                page,
            }) => {
                await open(page, example);
                await addFocusableNeighbours(page, example);
                await page.locator('#before').focus();
                await page.keyboard.press('Tab');
                await expectFocusShadow(page, 'Cats', true);

                const outer = await boxOf(tab(page, 'Cats'));
                const inner = await boxOf(
                    tab(page, 'Cats').locator('span.content')
                );
                const gaps = [
                    inner.x - outer.x,
                    inner.y - outer.y,
                    outer.x + outer.width - (inner.x + inner.width),
                    outer.y + outer.height - (inner.y + inner.height),
                ];

                expect(gaps[0]).toBeGreaterThan(0);
                for (const gap of gaps) {
                    expect(gap).toBeCloseTo(gaps[0], 0);
                }
            });
        }
    });

    test.describe('a vertical tab bar', () => {
        test.beforeEach(async ({ page }) => {
            await open(page, VERTICAL);
        });

        test('moves focus and selection with the up and down arrow keys', async ({
            page,
        }) => {
            await tab(page, 'Joker').focus();

            await page.keyboard.press('ArrowDown');
            await expectActive(page, 'Parasite');

            await page.keyboard.press('ArrowUp');
            await expectActive(page, 'Joker');
        });

        test('scrolls down to the tabs that do not fit, and back up', async ({
            page,
        }) => {
            await expectCanScroll(page, 'end', true);

            await scrollToTheEnd(page);
            await expectCanScroll(page, 'start', true);

            const bar = await boxOf(tabBar(page));
            const last = await boxOf(tab(page, 'Inception'));
            expect(last.y + last.height).toBeLessThanOrEqual(
                bar.y + bar.height + 1
            );

            await scrollByClicking(page, scrollButton(page, 'start'));
            await expectCanScroll(page, 'end', true);
        });

        test('reveals the tab that the keyboard moves to', async ({ page }) => {
            await tab(page, 'Joker').focus();

            await page.keyboard.press('End');
            await expectActive(page, 'Inception');
            await settled(tab(page, 'Inception'));

            const bar = await boxOf(tabBar(page));
            const last = await boxOf(tab(page, 'Inception'));
            expect(last.y).toBeGreaterThanOrEqual(bar.y - 1);
            expect(last.y + last.height).toBeLessThanOrEqual(
                bar.y + bar.height + 1
            );
        });
    });

    test.describe('when the tabs fit', () => {
        test('offers no scrolling', async ({ page }) => {
            await open(page, DYNAMIC_WIDTH);
            await expect(tab(page, 'Cats')).toBeVisible();

            // Nothing is marked on a bar that has not worked out what there is
            // to scroll to, so it looks the same as a bar that fits. Making the
            // tabs stop fitting, and then fit again, shows that the bar has, and
            // that it follows the window.
            await page.setViewportSize({ ...VIEWPORT, width: 240 });
            await expectCanScroll(page, 'end', true);

            await page.setViewportSize(VIEWPORT);
            await expectCanScroll(page, 'start', false);
            await expectCanScroll(page, 'end', false);
        });
    });

    test.describe('visual baselines', () => {
        // Pixel comparison only runs in the pinned Playwright Docker image
        // (locally via scripts/visual-tests-docker.sh, in CI via container:),
        // because macOS and Linux render fonts and anti-aliasing differently.
        test.skip(
            !process.env.RUN_VISUAL_SNAPSHOTS,
            'visual snapshots only run in the pinned Docker/CI environment'
        );

        // The docs load their icons from a CDN. Standing in for them keeps the
        // baselines independent of the network, and of the icons themselves.
        test.beforeEach(async ({ page }) => {
            await page.route('**/lime-icons8/**', (route) =>
                route.fulfill({
                    contentType: 'image/svg+xml',
                    body: PLACEHOLDER_ICON,
                })
            );
        });

        test('overflowing, at the start', async ({ page }) => {
            await open(page, BASIC);
            await expectCanScroll(page, 'end', true);

            await expect(tabBar(page)).toHaveScreenshot(
                'tab-bar-overflowing-start.png'
            );
        });

        test('overflowing, scrolled once', async ({ page }) => {
            await open(page, BASIC);
            await scrollByClicking(page, scrollButton(page, 'end'));
            await page.mouse.move(0, 0);

            await expect(tabBar(page)).toHaveScreenshot(
                'tab-bar-overflowing-middle.png'
            );
        });

        test('overflowing, scrolled to the end', async ({ page }) => {
            await open(page, BASIC);
            await scrollToTheEnd(page);
            await page.mouse.move(0, 0);

            await expect(tabBar(page)).toHaveScreenshot(
                'tab-bar-overflowing-end.png'
            );
        });

        test('hovering a scroll button', async ({ page }) => {
            await open(page, BASIC);
            const next = scrollButton(page, 'end');
            await expectCanScroll(page, 'end', true);
            await next.hover();

            await expect(tabBar(page)).toHaveScreenshot(
                'tab-bar-hovering-scroll-button.png'
            );
        });

        test('with dynamic tab widths', async ({ page }) => {
            await open(page, DYNAMIC_WIDTH);
            await expect(tab(page, 'Cats')).toBeVisible();

            await expect(tabBar(page)).toHaveScreenshot(
                'tab-bar-dynamic-width.png'
            );
        });

        test('with equal tab widths', async ({ page }) => {
            await open(page, EQUAL_WIDTH);
            await expect(tab(page, 'Cats')).toBeVisible();

            await expect(tabBar(page)).toHaveScreenshot(
                'tab-bar-equal-width.png'
            );
        });

        test('hovering a tab', async ({ page }) => {
            await open(page, DYNAMIC_WIDTH);
            await tab(page, 'Dogs').hover();

            await expect(tabBar(page)).toHaveScreenshot(
                'tab-bar-hovering-tab.png'
            );
        });

        test('vertical, at the start', async ({ page }) => {
            await open(page, VERTICAL);
            await expectCanScroll(page, 'end', true);

            await expect(tabBar(page)).toHaveScreenshot(
                'tab-bar-vertical-start.png'
            );
        });

        test('vertical, scrolled to the end', async ({ page }) => {
            await open(page, VERTICAL);
            await scrollToTheEnd(page);
            await page.mouse.move(0, 0);

            await expect(tabBar(page)).toHaveScreenshot(
                'tab-bar-vertical-end.png'
            );
        });

        test('with limits on the width of the tabs', async ({ page }) => {
            await page.goto(`/#/debug/${TAB_WIDTH}`);
            await expect(tabBar(page)).toHaveCount(2);
            const bars = await tabBar(page).all();
            for (const bar of bars) {
                await expect(bar).toHaveClass(/hydrated/);
            }

            await expect(page.locator(TAB_WIDTH)).toHaveScreenshot(
                'tab-bar-tab-width.png'
            );
        });

        test('with keyboard focus on a tab', async ({ page }) => {
            await open(page, DYNAMIC_WIDTH);
            await addFocusableNeighbours(page, DYNAMIC_WIDTH);
            await page.locator('#before').focus();
            await page.keyboard.press('Tab');
            await expect(tab(page, 'Cats')).toBeFocused();

            await expect(tabBar(page)).toHaveScreenshot(
                'tab-bar-keyboard-focus.png'
            );
        });
    });
});
