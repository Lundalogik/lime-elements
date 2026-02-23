import { render, h } from '@stencil/vitest';

describe('limel-collapsible-section', () => {
    describe('with a header and body', () => {
        let root: HTMLElement;
        let waitForChanges: () => Promise<void>;
        let setProps: (props: Record<string, any>) => void;
        let spyOnEvent: (eventName: string) => any;

        beforeEach(async () => {
            const result = await render(
                <limel-collapsible-section header="Header text">
                    Body text <button>Test</button>
                </limel-collapsible-section>
            );
            root = result.root;
            waitForChanges = result.waitForChanges;
            setProps = result.setProps;
            spyOnEvent = result.spyOnEvent;
            await waitForChanges();
        });

        it('displays the correct header', () => {
            const header = root.shadowRoot.querySelector('header');
            expect(header.textContent).toContain('Header text');
        });

        it('is collapsed by default', () => {
            expect((root as any).isOpen).toEqual(false);
            const body = root.shadowRoot.querySelector('.body');
            expect(body.getAttribute('aria-hidden')).toEqual('true');
        });

        describe('when changing the header', () => {
            it('displays the new header', async () => {
                setProps({ header: 'new header' });
                await waitForChanges();

                const header = root.shadowRoot.querySelector('header');
                expect(header.textContent).toContain('new header');
            });
        });

        describe('when clicking the header', () => {
            it('opens and emits open event', async () => {
                const openSpy = spyOnEvent('open');
                const closeSpy = spyOnEvent('close');

                const toggle =
                    root.shadowRoot.querySelector('.open-close-toggle');
                (toggle as HTMLElement).click();
                await waitForChanges();

                expect((root as any).isOpen).toEqual(true);
                const body = root.shadowRoot.querySelector('.body');
                expect(body.getAttribute('aria-hidden')).toEqual('false');
                expect(openSpy).toHaveReceivedEventTimes(1);
                expect(closeSpy).not.toHaveReceivedEvent();
            });
        });

        describe('when setting `isOpen` to `true`', () => {
            it('opens without emitting events', async () => {
                const openSpy = spyOnEvent('open');
                const closeSpy = spyOnEvent('close');

                setProps({ isOpen: true });
                await waitForChanges();

                expect((root as any).isOpen).toEqual(true);
                expect(openSpy).not.toHaveReceivedEvent();
                expect(closeSpy).not.toHaveReceivedEvent();
            });
        });
    });

    describe('with an action', () => {
        it('has an action button that emits action event when clicked', async () => {
            const actions = [{ id: 'abc', icon: 'unit-test' }];

            const result = await render(
                <limel-collapsible-section
                    header="Header text"
                    actions={actions}
                >
                    Body text
                </limel-collapsible-section>
            );
            const actionSpy = result.spyOnEvent('action');
            await result.waitForChanges();

            const actionButton =
                result.root.shadowRoot.querySelector('limel-icon-button');
            expect(actionButton).toBeTruthy();

            (actionButton as HTMLElement).click();
            await result.waitForChanges();

            expect(actionSpy).toHaveReceivedEventTimes(1);
            expect(actionSpy).toHaveReceivedEventDetail(actions[0]);
        });
    });
});
