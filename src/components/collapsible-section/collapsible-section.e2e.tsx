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

            it('marks the body as `inert` when collapsed', () => {
                const body = root.shadowRoot.querySelector('.body');
                expect(body.hasAttribute('inert')).toBe(true);
            });

            it('removes `inert` from the body when open', async () => {
                await setProps({ isOpen: true });
                await waitForChanges();

                const body = root.shadowRoot.querySelector('.body');
                expect(body.hasAttribute('inert')).toBe(false);
            });

            it('keeps slotted content out of the tab order when collapsed', () => {
                const button = root.querySelector('button') as HTMLElement;
                button.focus();

                expect(document.activeElement).not.toBe(button);
            });

            it('lets slotted content receive focus when open', async () => {
                await setProps({ isOpen: true });
                await waitForChanges();

                const button = root.querySelector('button') as HTMLElement;
                button.focus();

                expect(document.activeElement).toBe(button);
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

    describe('heading level', () => {
        const renderSection = async (props: Record<string, unknown> = {}) => {
            const result = await render(
                <limel-collapsible-section header="Header text" {...props}>
                    Body text
                </limel-collapsible-section>
            );
            await result.waitForChanges();

            return result;
        };

        const findHeading = (root: HTMLElement) =>
            root.shadowRoot.querySelector('.title');

        it('draws the header as an h2 by default', async () => {
            const { root } = await renderSection();

            expect(findHeading(root).localName).toBe('h2');
        });

        it('draws the header with the element of the heading level', async () => {
            const { root } = await renderSection({ headingLevel: 4 });

            expect(findHeading(root).localName).toBe('h4');
        });

        it('draws the header again when the heading level changes', async () => {
            const { root, setProps, waitForChanges } = await renderSection();

            await setProps({ headingLevel: 3 });
            await waitForChanges();

            expect(findHeading(root).localName).toBe('h3');
        });

        it('draws the header in the same place and size whatever the heading level', async () => {
            const rects = [];

            for (const headingLevel of [1, 2, 3, 4, 5, 6]) {
                const { root } = await renderSection({ headingLevel });
                const { left, top, width, height } =
                    findHeading(root).getBoundingClientRect();
                rects.push({ left, top, width, height });
            }

            expect(rects).toEqual(rects.map(() => rects[0]));
        });

        describe('that is not a whole number from 1 to 6', () => {
            let warn: ReturnType<typeof vi.spyOn>;

            beforeEach(() => {
                warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            });

            afterEach(() => {
                warn.mockRestore();
            });

            it('draws an h2 and warns when it is too high', async () => {
                const { root } = await renderSection({ headingLevel: 7 });

                expect(findHeading(root).localName).toBe('h2');
                expect(warn).toHaveBeenCalledTimes(1);
            });

            it('draws an h2 and warns when it is not a whole number', async () => {
                const { root } = await renderSection({ headingLevel: 2.5 });

                expect(findHeading(root).localName).toBe('h2');
                expect(warn).toHaveBeenCalledTimes(1);
            });

            it('warns when the heading level changes to one that is not valid', async () => {
                const { root, setProps, waitForChanges } = await renderSection({
                    headingLevel: 3,
                });

                await setProps({ headingLevel: 0 });
                await waitForChanges();

                expect(findHeading(root).localName).toBe('h2');
                expect(warn).toHaveBeenCalledTimes(1);
            });

            it('says what the heading level is and what is drawn instead', async () => {
                await renderSection({ headingLevel: 7 });

                expect(warn).toHaveBeenCalledWith(
                    'limel-collapsible-section: headingLevel must be a whole number from 1 to 6, but it is 7. The heading is drawn as an h2 instead.'
                );
            });
        });
    });
});
