import { render, h } from '@stencil/vitest';

describe('limel-collapsible-section', () => {
    describe('with a header and body', () => {
        let root: HTMLElement;
        let waitForChanges: () => Promise<void>;
        let setProps: (props: Record<string, any>) => Promise<void>;
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
                await setProps({ header: 'new header' });
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

            it('closes and emits close event when clicked again', async () => {
                const toggle =
                    root.shadowRoot.querySelector('.open-close-toggle');

                // Open first
                (toggle as HTMLElement).click();
                await waitForChanges();
                expect((root as any).isOpen).toEqual(true);

                // Now set up spies and close
                const openSpy = spyOnEvent('open');
                const closeSpy = spyOnEvent('close');

                (toggle as HTMLElement).click();
                await waitForChanges();

                expect((root as any).isOpen).toEqual(false);
                const body = root.shadowRoot.querySelector('.body');
                expect(body.getAttribute('aria-hidden')).toEqual('true');
                expect(closeSpy).toHaveReceivedEventTimes(1);
                expect(openSpy).not.toHaveReceivedEvent();
            });
        });

        describe('keyboard accessibility', () => {
            it('has a focusable toggle button', () => {
                const toggle = root.shadowRoot.querySelector(
                    '.open-close-toggle'
                ) as HTMLElement;
                expect(toggle.tagName.toLowerCase()).toEqual('button');
            });

            it('has correct aria-expanded when collapsed', () => {
                const toggle =
                    root.shadowRoot.querySelector('.open-close-toggle');
                expect(toggle.getAttribute('aria-expanded')).toEqual('false');
            });

            it('has correct aria-expanded when open', async () => {
                await setProps({ isOpen: true });
                await waitForChanges();

                const toggle =
                    root.shadowRoot.querySelector('.open-close-toggle');
                expect(toggle.getAttribute('aria-expanded')).toEqual('true');
            });

            it('has aria-controls pointing to the body region', () => {
                const toggle =
                    root.shadowRoot.querySelector('.open-close-toggle');
                const body = root.shadowRoot.querySelector('.body');
                expect(toggle.getAttribute('aria-controls')).toEqual(
                    body.getAttribute('id')
                );
            });
        });

        describe('when setting `isOpen` to `true`', () => {
            it('opens without emitting events', async () => {
                const openSpy = spyOnEvent('open');
                const closeSpy = spyOnEvent('close');

                await setProps({ isOpen: true });
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
