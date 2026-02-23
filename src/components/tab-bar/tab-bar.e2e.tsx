import { render, h } from '@stencil/vitest';

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
