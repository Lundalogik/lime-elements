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
    });
});
