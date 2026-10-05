import { render, h } from '@stencil/vitest';

// Resolves once the position has stayed the same for a few frames, which is how
// a smooth scroll is known to be over.
const settled = async (read: () => number) => {
    let previous = NaN;
    let stableFrames = 0;
    await vi.waitFor(
        () => {
            const current = read();
            stableFrames = current === previous ? stableFrames + 1 : 0;
            previous = current;
            if (stableFrames < 3) {
                throw new Error('Still scrolling');
            }
        },
        { interval: 50, timeout: 3000 }
    );
};

const scrollAreaOf = (scroller: HTMLLimelScrollerElement) =>
    scroller.shadowRoot.querySelector<HTMLElement>('div.scroll-area');

const endArrowOf = (scroller: HTMLLimelScrollerElement) =>
    scroller.shadowRoot.querySelector<HTMLElement>(
        'div.scroll-button.end div.arrow-button'
    );

const canScroll = (scroller: HTMLLimelScrollerElement, edge: string) =>
    scroller.shadowRoot
        .querySelector('div.scroller')
        .classList.contains(`can-scroll-to-${edge}`);

const overlap = (a: DOMRect, b: DOMRect, axis: 'horizontal' | 'vertical') =>
    axis === 'horizontal'
        ? Math.min(a.right, b.right) - Math.max(a.left, b.left)
        : Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);

const isWithin = (a: DOMRect, b: DOMRect, axis: 'horizontal' | 'vertical') =>
    axis === 'horizontal'
        ? a.left >= b.left && a.right <= b.right
        : a.top >= b.top && a.bottom <= b.bottom;

// The item at the very end of the scroller is under the arrow, and faded.
const itemAtTheEnd = (
    scroller: HTMLLimelScrollerElement,
    items: NodeListOf<HTMLElement>,
    axis: 'horizontal' | 'vertical'
) => {
    const box = scrollAreaOf(scroller).getBoundingClientRect();
    const [start, end] =
        axis === 'horizontal'
            ? (['left', 'right'] as const)
            : (['top', 'bottom'] as const);

    return [...items].find((item) => {
        const itemBox = item.getBoundingClientRect();

        return itemBox[start] < box[end] && itemBox[end] >= box[end];
    });
};

const fadeSizeOf = (
    scroller: HTMLLimelScrollerElement,
    axis: 'horizontal' | 'vertical'
) => {
    const fade = scroller.shadowRoot.querySelector<HTMLElement>(
        'div.scroll-fade.start'
    );

    return axis === 'horizontal' ? fade.offsetWidth : fade.offsetHeight;
};

// An observer reports a change in size on the frame after the change.
const afterFrames = (count: number) =>
    new Promise<void>((resolve) => {
        const wait = (left: number) =>
            left === 0
                ? resolve()
                : requestAnimationFrame(() => wait(left - 1));
        wait(count);
    });

// A browser scrolls an element that is completely hidden to the middle, which
// would reveal its neighbors by chance. That is why the tests for revealing
// start with an item that is partly visible, or flush with the edge.
describe('limel-scroller', () => {
    describe('when the content is wider than the scroller', () => {
        const renderScroller = async () => {
            const { root, waitForChanges } = await render(
                <div style={{ width: '24rem' }}>
                    <limel-scroller>
                        {Array.from({ length: 12 }, (_, index) => (
                            <button style={{ width: '8rem', height: '2rem' }}>
                                {`Item ${index + 1}`}
                            </button>
                        ))}
                    </limel-scroller>
                </div>
            );
            await waitForChanges();
            const scroller = root.querySelector('limel-scroller');

            return {
                scroller,
                area: scrollAreaOf(scroller),
                items: root.querySelectorAll('button'),
            };
        };

        it('only offers to scroll towards the end', async () => {
            const { scroller } = await renderScroller();

            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(true)
            );
            expect(canScroll(scroller, 'start')).toBe(false);
        });

        it('scrolls almost a page when asked to', async () => {
            const { scroller, area } = await renderScroller();
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(true)
            );

            endArrowOf(scroller).click();
            await settled(() => area.scrollLeft);

            const width = area.getBoundingClientRect().width;
            expect(area.scrollLeft).toBeGreaterThan(width * 0.6);
            expect(area.scrollLeft).toBeLessThan(width);
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'start')).toBe(true)
            );
        });

        it('leaves what was under the arrow clear of the fade at the other end, after scrolling a page of a narrow scroller', async () => {
            const { root, waitForChanges } = await render(
                <div style={{ width: '16rem' }}>
                    <limel-scroller>
                        {Array.from({ length: 12 }, (_, index) => (
                            <button style={{ width: '8rem', height: '2rem' }}>
                                {`Item ${index + 1}`}
                            </button>
                        ))}
                    </limel-scroller>
                </div>
            );
            await waitForChanges();
            const scroller = root.querySelector('limel-scroller');
            const area = scrollAreaOf(scroller);
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(true)
            );
            const underTheArrow = itemAtTheEnd(
                scroller,
                root.querySelectorAll('button'),
                'horizontal'
            );

            endArrowOf(scroller).click();
            await settled(() => area.scrollLeft);

            expect(
                underTheArrow.getBoundingClientRect().right
            ).toBeGreaterThanOrEqual(
                area.getBoundingClientRect().left +
                    fadeSizeOf(scroller, 'horizontal') -
                    1
            );
        });

        it('reveals a focused item that is partly visible, with a glimpse of the next one', async () => {
            const { area, items } = await renderScroller();
            area.scrollTo({ left: 64, behavior: 'auto' });

            items[3].focus();
            await settled(() => area.scrollLeft);

            const areaBox = area.getBoundingClientRect();
            expect(
                isWithin(
                    items[3].getBoundingClientRect(),
                    areaBox,
                    'horizontal'
                )
            ).toBe(true);
            expect(
                overlap(items[4].getBoundingClientRect(), areaBox, 'horizontal')
            ).toBeGreaterThan(0);
        });

        it('reveals a focused item that is partly visible, with a glimpse of the previous one', async () => {
            const { area, items } = await renderScroller();
            area.scrollTo({ left: 192, behavior: 'auto' });

            items[1].focus();
            await settled(() => area.scrollLeft);

            const areaBox = area.getBoundingClientRect();
            expect(
                isWithin(
                    items[1].getBoundingClientRect(),
                    areaBox,
                    'horizontal'
                )
            ).toBe(true);
            expect(
                overlap(items[0].getBoundingClientRect(), areaBox, 'horizontal')
            ).toBeGreaterThan(0);
        });

        it('reveals a glimpse of the next item, when the focused one is flush with the edge', async () => {
            const { area, items } = await renderScroller();

            items[2].focus();
            await settled(() => area.scrollLeft);

            const areaBox = area.getBoundingClientRect();
            expect(
                overlap(items[3].getBoundingClientRect(), areaBox, 'horizontal')
            ).toBeGreaterThan(0);
        });

        describe('and each item holds a button', () => {
            const renderScrollerWithHolders = async () => {
                const { root, waitForChanges } = await render(
                    <div style={{ width: '24rem' }}>
                        <limel-scroller>
                            {Array.from({ length: 12 }, (_, index) => (
                                <div style={{ width: '8rem', height: '2rem' }}>
                                    <button
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    >
                                        {`Item ${index + 1}`}
                                    </button>
                                </div>
                            ))}
                        </limel-scroller>
                    </div>
                );
                await waitForChanges();
                const scroller = root.querySelector('limel-scroller');
                const area = scrollAreaOf(scroller);
                area.scrollTo({ left: 64, behavior: 'auto' });

                return {
                    scroller,
                    area,
                    holders: scroller.querySelectorAll(':scope > div'),
                    buttons: root.querySelectorAll('button'),
                };
            };

            it('reveals the item that holds the focused element, with a glimpse of the next one', async () => {
                const { area, holders, buttons } =
                    await renderScrollerWithHolders();

                buttons[3].focus();
                await settled(() => area.scrollLeft);

                const areaBox = area.getBoundingClientRect();
                expect(
                    isWithin(
                        holders[3].getBoundingClientRect(),
                        areaBox,
                        'horizontal'
                    )
                ).toBe(true);
                expect(
                    overlap(
                        holders[4].getBoundingClientRect(),
                        areaBox,
                        'horizontal'
                    )
                ).toBeGreaterThan(0);
            });

            it('reveals the item that holds an element it is asked to reveal, with a glimpse of the next one', async () => {
                const { scroller, area, holders, buttons } =
                    await renderScrollerWithHolders();

                await scroller.reveal(buttons[3]);
                await settled(() => area.scrollLeft);

                const areaBox = area.getBoundingClientRect();
                expect(
                    isWithin(
                        holders[3].getBoundingClientRect(),
                        areaBox,
                        'horizontal'
                    )
                ).toBe(true);
                expect(
                    overlap(
                        holders[4].getBoundingClientRect(),
                        areaBox,
                        'horizontal'
                    )
                ).toBeGreaterThan(0);
            });
        });

        it('reveals an item when asked to, even though it has no focus', async () => {
            const { scroller, area, items } = await renderScroller();
            area.scrollTo({ left: 64, behavior: 'auto' });

            await scroller.reveal(items[3]);
            await settled(() => area.scrollLeft);

            const areaBox = area.getBoundingClientRect();
            expect(
                isWithin(
                    items[3].getBoundingClientRect(),
                    areaBox,
                    'horizontal'
                )
            ).toBe(true);
            expect(
                overlap(items[4].getBoundingClientRect(), areaBox, 'horizontal')
            ).toBeGreaterThan(0);
        });

        it('jumps to the item, instead of gliding there, when asked to', async () => {
            const { scroller, area, items } = await renderScroller();

            await scroller.reveal(items[8], 'auto');

            expect(
                isWithin(
                    items[8].getBoundingClientRect(),
                    area.getBoundingClientRect(),
                    'horizontal'
                )
            ).toBe(true);
        });
    });

    describe('when it is scaled, as it is in a dialog that is opening', () => {
        const renderScaledScroller = async () => {
            const { root, waitForChanges } = await render(
                <div
                    style={{
                        width: '24rem',
                        transform: 'scale(0.5)',
                        transformOrigin: 'top left',
                    }}
                >
                    <limel-scroller>
                        {Array.from({ length: 12 }, (_, index) => (
                            <button style={{ width: '8rem', height: '2rem' }}>
                                {`Item ${index + 1}`}
                            </button>
                        ))}
                    </limel-scroller>
                </div>
            );
            await waitForChanges();
            const scroller = root.querySelector('limel-scroller');

            return {
                scroller,
                area: scrollAreaOf(scroller),
                items: root.querySelectorAll('button'),
            };
        };

        it('scrolls almost a page, as it is laid out, when asked to', async () => {
            const { scroller, area } = await renderScaledScroller();
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(true)
            );

            endArrowOf(scroller).click();
            await settled(() => area.scrollLeft);

            expect(area.scrollLeft).toBeGreaterThan(area.clientWidth * 0.6);
            expect(area.scrollLeft).toBeLessThan(area.clientWidth);
        });

        it('reveals an item, with a glimpse of the next one', async () => {
            const { scroller, area, items } = await renderScaledScroller();

            await scroller.reveal(items[8], 'auto');

            const areaBox = area.getBoundingClientRect();
            expect(
                isWithin(
                    items[8].getBoundingClientRect(),
                    areaBox,
                    'horizontal'
                )
            ).toBe(true);
            expect(
                overlap(items[9].getBoundingClientRect(), areaBox, 'horizontal')
            ).toBeGreaterThan(0);
        });
    });

    describe('when asked to reveal an item while it is hidden', () => {
        const renderHiddenScroller = async () => {
            const { root, waitForChanges } = await render(
                <div style={{ width: '24rem', display: 'none' }}>
                    <limel-scroller>
                        {Array.from({ length: 12 }, (_, index) => (
                            <button style={{ width: '8rem', height: '2rem' }}>
                                {`Item ${index + 1}`}
                            </button>
                        ))}
                    </limel-scroller>
                </div>
            );
            await waitForChanges();
            const scroller = root.querySelector('limel-scroller');

            return {
                root,
                scroller,
                area: scrollAreaOf(scroller),
                items: root.querySelectorAll('button'),
            };
        };

        it('reveals the item once it is shown', async () => {
            const { root, scroller, area, items } =
                await renderHiddenScroller();

            await scroller.reveal(items[8], 'auto');
            root.style.display = 'block';

            await vi.waitFor(() =>
                expect(
                    isWithin(
                        items[8].getBoundingClientRect(),
                        area.getBoundingClientRect(),
                        'horizontal'
                    )
                ).toBe(true)
            );
        });

        it('does not pull the scroller back to the item later on', async () => {
            const { root, scroller, area, items } =
                await renderHiddenScroller();
            await scroller.reveal(items[8], 'auto');
            root.style.display = 'block';
            await vi.waitFor(() => expect(area.scrollLeft).toBeGreaterThan(0));

            area.scrollTo({ left: 0, behavior: 'auto' });
            root.style.width = '20rem';
            await afterFrames(2);

            expect(area.scrollLeft).toBe(0);
        });
    });

    describe('for assistive technologies and the keyboard', () => {
        it('hides the arrows, and leaves nothing in them that can be focused', async () => {
            const { root, waitForChanges } = await render(
                <div style={{ width: '24rem' }}>
                    <limel-scroller>
                        <button>One</button>
                    </limel-scroller>
                </div>
            );
            await waitForChanges();
            const scroller = root.querySelector('limel-scroller');

            const arrows =
                scroller.shadowRoot.querySelectorAll('div.scroll-button');
            expect(arrows).toHaveLength(2);
            for (const arrow of arrows) {
                expect(arrow.getAttribute('aria-hidden')).toBe('true');
                expect(
                    arrow.querySelectorAll(
                        'button, a[href], input, select, textarea, [tabindex], [role]'
                    )
                ).toHaveLength(0);
            }
        });
    });

    describe('when the content fits', () => {
        it('offers no scrolling, and starts to when more items arrive', async () => {
            const { root, waitForChanges } = await render(
                <div style={{ width: '24rem' }}>
                    <limel-scroller>
                        <button>One</button>
                        <button>Two</button>
                    </limel-scroller>
                </div>
            );
            await waitForChanges();
            const scroller = root.querySelector('limel-scroller');
            expect(canScroll(scroller, 'end')).toBe(false);

            const added = Array.from({ length: 10 }, () => {
                const button = document.createElement('button');
                button.style.width = '8rem';
                scroller.append(button);

                return button;
            });
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(true)
            );

            for (const button of added) {
                button.remove();
            }
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(false)
            );
            expect(canScroll(scroller, 'start')).toBe(false);
        });
    });

    describe('when vertical, and the content is taller than the scroller', () => {
        const renderScroller = async () => {
            const { root, waitForChanges } = await render(
                <div>
                    <limel-scroller
                        orientation="vertical"
                        style={{ height: '12rem', width: '10rem' }}
                    >
                        {Array.from({ length: 12 }, (_, index) => (
                            <button style={{ height: '3rem' }}>
                                {`Item ${index + 1}`}
                            </button>
                        ))}
                    </limel-scroller>
                </div>
            );
            await waitForChanges();
            const scroller = root.querySelector('limel-scroller');

            return {
                scroller,
                area: scrollAreaOf(scroller),
                items: root.querySelectorAll('button'),
            };
        };

        it('only offers to scroll towards the end', async () => {
            const { scroller } = await renderScroller();

            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(true)
            );
            expect(canScroll(scroller, 'start')).toBe(false);
        });

        it('scrolls almost a page when asked to', async () => {
            const { scroller, area } = await renderScroller();
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(true)
            );

            endArrowOf(scroller).click();
            await settled(() => area.scrollTop);

            const height = area.getBoundingClientRect().height;
            expect(area.scrollTop).toBeGreaterThan(height * 0.6);
            expect(area.scrollTop).toBeLessThan(height);
        });

        it('leaves what was under the arrow clear of the fade at the other end, after scrolling a page', async () => {
            const { scroller, area, items } = await renderScroller();
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(true)
            );
            const underTheArrow = itemAtTheEnd(scroller, items, 'vertical');

            endArrowOf(scroller).click();
            await settled(() => area.scrollTop);

            expect(
                underTheArrow.getBoundingClientRect().bottom
            ).toBeGreaterThanOrEqual(
                area.getBoundingClientRect().top +
                    fadeSizeOf(scroller, 'vertical') -
                    1
            );
        });

        it('reveals a focused item that is partly visible, with a glimpse of the next one', async () => {
            const { area, items } = await renderScroller();
            area.scrollTo({ top: 24, behavior: 'auto' });

            items[4].focus();
            await settled(() => area.scrollTop);

            const areaBox = area.getBoundingClientRect();
            expect(
                isWithin(items[4].getBoundingClientRect(), areaBox, 'vertical')
            ).toBe(true);
            expect(
                overlap(items[5].getBoundingClientRect(), areaBox, 'vertical')
            ).toBeGreaterThan(0);
        });

        it('reveals a focused item that is partly visible, with a glimpse of the previous one', async () => {
            const { area, items } = await renderScroller();
            area.scrollTo({ top: 120, behavior: 'auto' });

            items[2].focus();
            await settled(() => area.scrollTop);

            const areaBox = area.getBoundingClientRect();
            expect(
                isWithin(items[2].getBoundingClientRect(), areaBox, 'vertical')
            ).toBe(true);
            expect(
                overlap(items[1].getBoundingClientRect(), areaBox, 'vertical')
            ).toBeGreaterThan(0);
        });

        it('reveals a glimpse of the next item, when the focused one is flush with the edge', async () => {
            const { area, items } = await renderScroller();

            items[3].focus();
            await settled(() => area.scrollTop);

            const areaBox = area.getBoundingClientRect();
            expect(
                overlap(items[4].getBoundingClientRect(), areaBox, 'vertical')
            ).toBeGreaterThan(0);
        });

        it('reveals an item when asked to, even though it has no focus', async () => {
            const { scroller, area, items } = await renderScroller();
            area.scrollTo({ top: 24, behavior: 'auto' });

            await scroller.reveal(items[4]);
            await settled(() => area.scrollTop);

            const areaBox = area.getBoundingClientRect();
            expect(
                isWithin(items[4].getBoundingClientRect(), areaBox, 'vertical')
            ).toBe(true);
            expect(
                overlap(items[5].getBoundingClientRect(), areaBox, 'vertical')
            ).toBeGreaterThan(0);
        });
    });

    describe('when its container is resized', () => {
        it('follows the width of the container', async () => {
            const { root, waitForChanges } = await render(
                <div style={{ width: '24rem' }}>
                    <limel-scroller>
                        {Array.from({ length: 12 }, (_, index) => (
                            <button style={{ width: '8rem', height: '2rem' }}>
                                {`Item ${index + 1}`}
                            </button>
                        ))}
                    </limel-scroller>
                </div>
            );
            await waitForChanges();
            const scroller = root.querySelector('limel-scroller');
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(true)
            );

            root.style.width = '120rem';
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(false)
            );

            root.style.width = '24rem';
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(true)
            );
        });

        it('keeps following the width of the container, after the scroller has been moved', async () => {
            const { root, waitForChanges } = await render(
                <div style={{ width: '24rem' }}>
                    <limel-scroller>
                        {Array.from({ length: 12 }, (_, index) => (
                            <button style={{ width: '8rem', height: '2rem' }}>
                                {`Item ${index + 1}`}
                            </button>
                        ))}
                    </limel-scroller>
                </div>
            );
            await waitForChanges();
            const scroller = root.querySelector('limel-scroller');
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(true)
            );

            root.append(scroller);
            root.style.width = '120rem';

            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(false)
            );
        });

        it('follows the height of the container, when vertical', async () => {
            const { root, waitForChanges } = await render(
                <div>
                    <limel-scroller
                        orientation="vertical"
                        style={{ height: '12rem', width: '10rem' }}
                    >
                        {Array.from({ length: 12 }, (_, index) => (
                            <button style={{ height: '3rem' }}>
                                {`Item ${index + 1}`}
                            </button>
                        ))}
                    </limel-scroller>
                </div>
            );
            await waitForChanges();
            const scroller = root.querySelector('limel-scroller');
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(true)
            );

            scroller.style.height = '60rem';
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(false)
            );

            scroller.style.height = '12rem';
            await vi.waitFor(() =>
                expect(canScroll(scroller, 'end')).toBe(true)
            );
        });
    });
});
