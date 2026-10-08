import { render, h } from '@stencil/vitest';

// More tabs than fit in a bar that is 22rem wide.
const manyTabs = (active?: number) =>
    Array.from({ length: 10 }, (_, index) => ({
        id: index,
        text: `Tab number ${index + 1}`,
        active: index === active,
    }));

const scrollAreaOf = (bar: HTMLLimelTabBarElement) =>
    bar.shadowRoot
        .querySelector('limel-scroller')
        .shadowRoot.querySelector<HTMLElement>('div.scroll-area');

const isActiveTabInView = (bar: HTMLLimelTabBarElement) => {
    const areaBox = scrollAreaOf(bar).getBoundingClientRect();
    const tabBox = bar.shadowRoot
        .querySelector('button[aria-selected="true"]')
        .getBoundingClientRect();

    return (
        areaBox.width > 0 &&
        tabBox.left >= areaBox.left &&
        tabBox.right <= areaBox.right
    );
};

const showsActiveTab = (bar: HTMLLimelTabBarElement) =>
    vi.waitFor(() => expect(isActiveTabInView(bar)).toBe(true), {
        timeout: 3000,
    });

const tabButtons = (bar: HTMLLimelTabBarElement) => [
    ...bar.shadowRoot.querySelectorAll<HTMLButtonElement>('button[role="tab"]'),
];

// Returns the event, to see whether the tab bar kept the page from acting on
// the key press.
const pressKey = (target: Element, init: KeyboardEventInit) => {
    const event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        composed: true,
        ...init,
    });
    target.dispatchEvent(event);

    return event;
};

describe('limel-tab-bar', () => {
    let tabs: Array<{ id: string; active?: boolean }>;

    beforeEach(() => {
        tabs = [{ id: 'foo', active: true }, { id: 'bar' }, { id: 'baz' }];
    });

    describe('when bar tab is clicked', () => {
        it('emits events for old and new active tab', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-tab-bar tabs={tabs}></limel-tab-bar>
            );
            const changeTabSpy = spyOnEvent('changeTab');
            await waitForChanges();

            const buttons = root.shadowRoot.querySelectorAll('button');
            (buttons[1] as HTMLElement).click();
            await waitForChanges();

            expect(changeTabSpy).toHaveReceivedEventTimes(2);

            const events = changeTabSpy.events.map(
                (event: CustomEvent) => event.detail
            );
            const barEvent = events.find((e: { id: string }) => e.id === 'bar');
            const fooEvent = events.find((e: { id: string }) => e.id === 'foo');
            expect(barEvent).toEqual({ id: 'bar', active: true });
            expect(fooEvent).toEqual({ id: 'foo', active: false });
        });

        it('gives the tab focus, also in browsers that do not do that for a clicked button', async () => {
            const { root, waitForChanges } = await render(
                <limel-tab-bar tabs={tabs}></limel-tab-bar>
            );
            await waitForChanges();

            tabButtons(root)[1].click();
            await waitForChanges();

            expect(root.shadowRoot.activeElement).toBe(tabButtons(root)[1]);
        });
    });

    describe('when tab clicked is to the left of the active one', () => {
        it('emits the inactive tab before the active tab', async () => {
            const newTabs = [
                { ...tabs[0], active: false },
                { ...tabs[1], active: true },
                tabs[2],
            ];
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-tab-bar tabs={newTabs}></limel-tab-bar>
            );
            const changeTabSpy = spyOnEvent('changeTab');
            await waitForChanges();

            const buttons = root.shadowRoot.querySelectorAll('button');
            (buttons[0] as HTMLElement).click();
            await waitForChanges();

            expect(changeTabSpy).toHaveReceivedEventTimes(2);
            const events = changeTabSpy.events.map(
                (event: CustomEvent) => event.detail
            );
            expect(events[0]).toEqual({ id: 'bar', active: false });
            expect(events[1]).toEqual({ id: 'foo', active: true });
        });
    });

    describe('when a tab becomes active through `tabs`, in a bar that had no active tab', () => {
        it('glides to it, like it does to any other tab that is activated from the outside', async () => {
            const { root, waitForChanges } = await render(
                <div style={{ width: '22rem' }}>
                    <limel-tab-bar tabs={manyTabs()}></limel-tab-bar>
                </div>
            );
            await waitForChanges();
            const bar = root.querySelector('limel-tab-bar');
            const scroller = bar.shadowRoot.querySelector('limel-scroller');
            const reveal = vi.spyOn(scroller, 'reveal');

            bar.tabs = manyTabs(8);
            await vi.waitFor(() => expect(reveal).toHaveBeenCalled());

            expect(reveal.mock.calls[0][1]).toBeUndefined();
            await showsActiveTab(bar);
        });
    });

    describe('when the bar is first shown with a tab that is far away active', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('jumps to the tab, instead of gliding there', async () => {
            const scrollBy = vi.spyOn(Element.prototype, 'scrollBy');

            const { root, waitForChanges } = await render(
                <div style={{ width: '22rem' }}>
                    <limel-tab-bar tabs={manyTabs(8)}></limel-tab-bar>
                </div>
            );
            await waitForChanges();
            await showsActiveTab(root.querySelector('limel-tab-bar'));

            expect(scrollBy).toHaveBeenCalled();
            expect(scrollBy.mock.calls[0][0]).toMatchObject({
                behavior: 'auto',
            });
        });
    });

    describe('when the bar is first rendered while it is hidden', () => {
        it('shows the active tab once the bar is shown', async () => {
            const { root, waitForChanges } = await render(
                <div style={{ width: '22rem', display: 'none' }}>
                    <limel-tab-bar tabs={manyTabs(8)}></limel-tab-bar>
                </div>
            );
            await waitForChanges();
            const bar = root.querySelector('limel-tab-bar');
            await bar.shadowRoot
                .querySelector('limel-scroller')
                .componentOnReady();
            await new Promise((resolve) => requestAnimationFrame(resolve));

            root.style.display = 'block';

            await showsActiveTab(bar);
        });
    });

    describe('when the bar is moved to another place in the page', () => {
        it('shows the active tab again', async () => {
            const { root, waitForChanges } = await render(
                <div style={{ width: '22rem' }}>
                    <limel-tab-bar tabs={manyTabs(8)}></limel-tab-bar>
                </div>
            );
            await waitForChanges();
            const bar = root.querySelector('limel-tab-bar');
            await showsActiveTab(bar);

            root.append(bar);

            await showsActiveTab(bar);
        });
    });

    describe('when a tab is added in front of the active one', () => {
        it('keeps the active tab in view', async () => {
            const { root, waitForChanges } = await render(
                <div style={{ width: '22rem' }}>
                    <limel-tab-bar tabs={manyTabs(8)}></limel-tab-bar>
                </div>
            );
            await waitForChanges();
            const bar = root.querySelector('limel-tab-bar');
            await showsActiveTab(bar);

            bar.tabs = [
                { id: 'new', text: 'A tab that was added in front' },
                ...manyTabs(8),
            ];
            await waitForChanges();

            await showsActiveTab(bar);
        });
    });

    describe('when the selection is cleared, and later given to the same tab again', () => {
        it('shows the tab, wherever the bar was scrolled to in between', async () => {
            const { root, waitForChanges } = await render(
                <div style={{ width: '22rem' }}>
                    <limel-tab-bar tabs={manyTabs(8)}></limel-tab-bar>
                </div>
            );
            await waitForChanges();
            const bar = root.querySelector('limel-tab-bar');
            await showsActiveTab(bar);

            bar.tabs = manyTabs();
            await waitForChanges();
            scrollAreaOf(bar).scrollTo({ left: 0, behavior: 'auto' });
            bar.tabs = manyTabs(8);
            await waitForChanges();

            await showsActiveTab(bar);
        });
    });

    describe('when already-active tab is clicked', () => {
        it('does not emit an event', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-tab-bar tabs={tabs}></limel-tab-bar>
            );
            const changeTabSpy = spyOnEvent('changeTab');
            await waitForChanges();

            const buttons = root.shadowRoot.querySelectorAll('button');
            (buttons[0] as HTMLElement).click();
            await waitForChanges();

            expect(changeTabSpy).not.toHaveReceivedEvent();
        });

        it('gives the tab focus, also in browsers that do not do that for a clicked button', async () => {
            const { root, waitForChanges } = await render(
                <limel-tab-bar tabs={tabs}></limel-tab-bar>
            );
            await waitForChanges();

            tabButtons(root)[0].click();
            await waitForChanges();

            expect(root.shadowRoot.activeElement).toBe(tabButtons(root)[0]);
        });
    });

    describe('the tab order', () => {
        const tabIndexes = (bar: HTMLLimelTabBarElement) =>
            tabButtons(bar).map((tab) => tab.getAttribute('tabindex'));

        it('has the selected tab in it, and no other', async () => {
            const { root, waitForChanges } = await render(
                <limel-tab-bar
                    tabs={[
                        { id: 'foo' },
                        { id: 'bar', active: true },
                        { id: 'baz' },
                    ]}
                ></limel-tab-bar>
            );
            await waitForChanges();

            expect(tabIndexes(root)).toEqual(['-1', '0', '-1']);
        });

        it('has the first tab in it, when no tab is selected, to let the keyboard reach the bar', async () => {
            const { root, waitForChanges } = await render(
                <limel-tab-bar
                    tabs={[{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }]}
                ></limel-tab-bar>
            );
            await waitForChanges();

            expect(tabIndexes(root)).toEqual(['0', '-1', '-1']);
        });

        it('follows the selection, also when it is made or cleared from the outside', async () => {
            const { root, waitForChanges } = await render(
                <limel-tab-bar
                    tabs={[{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }]}
                ></limel-tab-bar>
            );
            await waitForChanges();

            root.tabs = [
                { id: 'foo' },
                { id: 'bar' },
                { id: 'baz', active: true },
            ];
            await waitForChanges();
            expect(tabIndexes(root)).toEqual(['-1', '-1', '0']);

            root.tabs = [{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }];
            await waitForChanges();
            expect(tabIndexes(root)).toEqual(['0', '-1', '-1']);
        });

        it('lets the keyboard move on from the first tab, when no tab is selected', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-tab-bar
                    tabs={[{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }]}
                ></limel-tab-bar>
            );
            const changeTabSpy = spyOnEvent('changeTab');
            await waitForChanges();
            const [first] = tabButtons(root);

            first.focus();
            pressKey(first, { key: 'ArrowRight' });
            await waitForChanges();

            expect(
                changeTabSpy.events.map((e: CustomEvent) => e.detail)
            ).toEqual([{ id: 'bar', active: true }]);
            expect(tabIndexes(root)).toEqual(['-1', '0', '-1']);
        });
    });

    describe('a badge on a tab', () => {
        it('lets the pointer through to the tab, so that it shows no cursor or tooltip of its own', async () => {
            const { root, waitForChanges } = await render(
                <limel-tab-bar
                    tabs={[
                        { id: 'foo', text: 'Foo', badge: 99_940, active: true },
                    ]}
                ></limel-tab-bar>
            );
            await waitForChanges();
            const badge = root.shadowRoot.querySelector('limel-badge');
            const { x, y, width, height } = badge.getBoundingClientRect();

            const hit = root.shadowRoot.elementFromPoint(
                x + width / 2,
                y + height / 2
            );

            expect(hit.closest('button[role="tab"]')).not.toBeNull();
            expect(hit.closest('limel-badge')).toBeNull();
        });
    });

    describe('the selected tab', () => {
        it('takes the accent of the part of the page it is in, for its icon as for its text', async () => {
            const { root } = await render(
                <div style={{ '--lime-primary-color': 'rgb(255, 0, 0)' }}>
                    <limel-tab-bar
                        tabs={[
                            {
                                id: 'foo',
                                text: 'Foo',
                                icon: 'cat',
                                active: true,
                            },
                        ]}
                    ></limel-tab-bar>
                </div>
            );
            const tab = root
                .querySelector('limel-tab-bar')
                .shadowRoot.querySelector('button[role="tab"]');
            const colorOf = (selector: string) =>
                getComputedStyle(tab.querySelector(selector)).color;

            await vi.waitFor(() => {
                expect(colorOf('span.text')).toBe('rgb(255, 0, 0)');
                expect(colorOf('limel-icon')).toBe('rgb(255, 0, 0)');
            });
        });
    });

    describe('when a key is pressed on a tab', () => {
        const renderBar = async (barTabs: typeof tabs = tabs) => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-tab-bar tabs={barTabs}></limel-tab-bar>
            );
            const changeTabSpy = spyOnEvent('changeTab');
            await waitForChanges();

            return { bar: root, waitForChanges, changeTabSpy };
        };

        const activatedIds = (changeTabSpy: { events: unknown[] }) =>
            (changeTabSpy.events as CustomEvent[])
                .map((event) => event.detail)
                .filter((tab: { active: boolean }) => tab.active)
                .map((tab: { id: string }) => tab.id);

        describe.each([
            ['ArrowLeft', 0],
            ['ArrowRight', 2],
            ['Home', 0],
            ['End', 2],
        ])('%s', (key, expectedIndex) => {
            it('selects the tab it moves to, and gives it focus', async () => {
                const { bar, waitForChanges, changeTabSpy } = await renderBar([
                    { id: 'foo' },
                    { id: 'bar', active: true },
                    { id: 'baz' },
                ]);

                pressKey(tabButtons(bar)[1], { key: key });
                await waitForChanges();

                expect(activatedIds(changeTabSpy)).toEqual([
                    ['foo', 'bar', 'baz'][expectedIndex],
                ]);
                expect(bar.shadowRoot.activeElement).toBe(
                    tabButtons(bar)[expectedIndex]
                );
            });

            it('keeps the page from scrolling', async () => {
                const { bar } = await renderBar();

                const event = pressKey(tabButtons(bar)[0], { key: key });

                expect(event.defaultPrevented).toBe(true);
            });
        });

        it('goes around to the last tab from the first one, and the other way around', async () => {
            const { bar, waitForChanges, changeTabSpy } = await renderBar();

            pressKey(tabButtons(bar)[0], { key: 'ArrowLeft' });
            await waitForChanges();
            pressKey(tabButtons(bar)[2], { key: 'ArrowRight' });
            await waitForChanges();

            expect(activatedIds(changeTabSpy)).toEqual(['baz', 'foo']);
        });

        it('keeps the page from scrolling, also when there is no other tab to go to', async () => {
            const { bar, waitForChanges, changeTabSpy } = await renderBar([
                { id: 'foo', active: true },
            ]);

            const event = pressKey(tabButtons(bar)[0], { key: 'ArrowRight' });
            await waitForChanges();

            expect(event.defaultPrevented).toBe(true);
            expect(changeTabSpy).not.toHaveReceivedEvent();
        });

        it.each([['ArrowUp'], ['ArrowDown'], ['PageDown'], ['Enter'], ['a']])(
            'leaves "%s" alone',
            async (key) => {
                const { bar, waitForChanges, changeTabSpy } = await renderBar();

                const event = pressKey(tabButtons(bar)[0], { key: key });
                await waitForChanges();

                expect(event.defaultPrevented).toBe(false);
                expect(changeTabSpy).not.toHaveReceivedEvent();
            }
        );

        it.each([['altKey'], ['ctrlKey'], ['metaKey']])(
            'leaves an arrow key that is pressed with %s to the browser',
            async (modifier) => {
                const { bar, waitForChanges, changeTabSpy } = await renderBar();

                const event = pressKey(tabButtons(bar)[0], {
                    key: 'ArrowRight',
                    [modifier]: true,
                });
                await waitForChanges();

                expect(event.defaultPrevented).toBe(false);
                expect(changeTabSpy).not.toHaveReceivedEvent();
            }
        );

        it('moves on from the tab that has focus, which is not always the selected one', async () => {
            const { bar, waitForChanges, changeTabSpy } = await renderBar();
            const last = tabButtons(bar)[2];

            last.focus();
            pressKey(last, { key: 'ArrowLeft' });
            await waitForChanges();

            expect(activatedIds(changeTabSpy)).toEqual(['bar']);
        });

        it.each([
            ['ArrowLeft', 1, 0],
            ['ArrowRight', 0, 1],
            ['Home', 2, 0],
            ['End', 0, 2],
        ])(
            'moves the focus to the selected tab, when %s leads there from another tab that has focus',
            async (key, focusedIndex, selectedIndex) => {
                const { bar, waitForChanges, changeTabSpy } = await renderBar(
                    ['foo', 'bar', 'baz'].map((id, index) => ({
                        id: id,
                        active: index === selectedIndex,
                    }))
                );
                const focused = tabButtons(bar)[focusedIndex];

                focused.focus();
                pressKey(focused, { key: key });
                await waitForChanges();

                expect(bar.shadowRoot.activeElement).toBe(
                    tabButtons(bar)[selectedIndex]
                );
                expect(changeTabSpy).not.toHaveReceivedEvent();
            }
        );

        it('moves to a tab that was added after the bar was first shown', async () => {
            const { bar, waitForChanges, changeTabSpy } = await renderBar();

            bar.tabs = [...tabs, { id: 'qux' }];
            await waitForChanges();
            pressKey(tabButtons(bar)[0], { key: 'End' });
            await waitForChanges();

            expect(activatedIds(changeTabSpy)).toEqual(['qux']);
        });
    });
});
