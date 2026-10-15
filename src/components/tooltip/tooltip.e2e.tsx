import { render, h } from '@stencil/vitest';

describe('limel-tooltip', () => {
    async function setup() {
        const { root, waitForChanges } = await render(
            <div>
                <a id="tooltip-test">Testing tooltip</a>
                <limel-tooltip
                    elementId="tooltip-test"
                    label="Description"
                ></limel-tooltip>
            </div>
        );
        await waitForChanges();

        const anchor = root.querySelector('a');
        const tooltip = root.querySelector(
            'limel-tooltip'
        ) as HTMLLimelTooltipElement;

        return { root, anchor, tooltip, waitForChanges };
    }

    test('limel-portal is opened when the owner element is hovered', async () => {
        const { anchor, tooltip, waitForChanges } = await setup();

        anchor!.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        // TooltipTimer has a 500ms delay before showing
        await new Promise((resolve) => setTimeout(resolve, 800));
        await waitForChanges();

        const portal = tooltip?.shadowRoot?.querySelector('limel-portal');
        expect((portal as any)?.visible).toBeTruthy();
    });

    describe('description of the owner element', () => {
        test('is set on an owner element inside a shadow root', async () => {
            const { root, waitForChanges } = await render(<div />);
            const host = document.createElement('div');
            const shadowRoot = host.attachShadow({ mode: 'open' });
            shadowRoot.innerHTML = `
                <button id="owner">Save</button>
                <limel-tooltip element-id="owner" label="Persist the draft" />
            `;
            root.append(host);
            await waitForChanges();

            const owner = shadowRoot.querySelector('#owner');
            await vi.waitFor(() => {
                expect(owner?.getAttribute('aria-description')).toBe(
                    'Persist the draft'
                );
            });
        });

        test('does not repeat the label of an icon button', async () => {
            const { root, waitForChanges } = await render(
                <limel-icon-button
                    icon="search"
                    label="Search"
                    helperLabel="Find on this page"
                />
            );
            await waitForChanges();

            const button = root.shadowRoot!.querySelector('button');
            expect(button!.getAttribute('aria-label')).toBe('Search');
            await vi.waitFor(() => {
                expect(button?.getAttribute('aria-description')).toBe(
                    'Find on this page'
                );
            });
        });

        describe('when the owner passes the focus on to an element inside', () => {
            async function setupButton() {
                const { root, waitForChanges } = await render(
                    <div>
                        <limel-button
                            id="owner"
                            icon={{ name: 'search', title: 'Search' }}
                        />
                        <limel-tooltip
                            elementId="owner"
                            label="Search"
                            helperLabel="Find on this page"
                        />
                    </div>
                );
                await waitForChanges();

                const owner = root.querySelector('limel-button')!;
                const tooltip = root.querySelector('limel-tooltip')!;
                const button = owner.shadowRoot!.querySelector('button');

                return { owner, tooltip, button, waitForChanges };
            }

            test('is set on the element inside, not on the owner', async () => {
                const { owner, button } = await setupButton();

                await vi.waitFor(() => {
                    expect(button?.getAttribute('aria-description')).toBe(
                        'Find on this page'
                    );
                });
                expect(owner.hasAttribute('aria-description')).toBe(false);
            });

            test('is updated on the element inside', async () => {
                const { button, tooltip, waitForChanges } = await setupButton();
                tooltip.label = 'Find';
                await waitForChanges();

                await vi.waitFor(() => {
                    expect(button?.getAttribute('aria-description')).toBe(
                        'Find. Find on this page'
                    );
                });
            });

            test('is removed from the element inside when the tooltip is removed', async () => {
                const { button, tooltip, waitForChanges } = await setupButton();
                await vi.waitFor(() => {
                    expect(button?.getAttribute('aria-description')).toBe(
                        'Find on this page'
                    );
                });

                tooltip.remove();
                await waitForChanges();

                expect(button!.hasAttribute('aria-description')).toBe(false);
            });

            test('leaves out a label that repeats the text of the button', async () => {
                const { root, waitForChanges } = await render(
                    <div>
                        <limel-button id="owner" label="Save" />
                        <limel-tooltip elementId="owner" label="save" />
                        <limel-button id="other" label="Send" />
                        <limel-tooltip elementId="other" label="Send it" />
                    </div>
                );
                await waitForChanges();

                const [owner, other] = [
                    ...root.querySelectorAll('limel-button'),
                ];
                const ownerButton = owner.shadowRoot!.querySelector('button');
                const otherButton = other.shadowRoot!.querySelector('button');

                await vi.waitFor(() => {
                    expect(otherButton?.getAttribute('aria-description')).toBe(
                        'Send it'
                    );
                });
                expect(ownerButton!.hasAttribute('aria-description')).toBe(
                    false
                );
            });
        });

        describe('when the owner is not focusable itself', () => {
            async function setupOwner(owner: HTMLElement) {
                const { root, waitForChanges } = await render(<div />);
                owner.id = 'owner';
                const tooltip = document.createElement('limel-tooltip');
                tooltip.elementId = 'owner';
                tooltip.label = 'About the owner';
                root.append(owner, tooltip);
                await waitForChanges();
            }

            test('is set on the first focusable element inside it', async () => {
                const owner = document.createElement('div');
                owner.innerHTML = '<span>Text</span><a href="#">Link</a>';
                await setupOwner(owner);

                const link = owner.querySelector('a');
                await vi.waitFor(() => {
                    expect(link?.getAttribute('aria-description')).toBe(
                        'About the owner'
                    );
                });
                expect(owner.hasAttribute('aria-description')).toBe(false);
            });

            test('is set on the first focusable element inside its shadow root', async () => {
                const owner = document.createElement('div');
                const shadowRoot = owner.attachShadow({ mode: 'open' });
                shadowRoot.innerHTML = '<p><button>Inside</button></p>';
                await setupOwner(owner);

                const button = shadowRoot.querySelector('button');
                await vi.waitFor(() => {
                    expect(button?.getAttribute('aria-description')).toBe(
                        'About the owner'
                    );
                });
                expect(owner.hasAttribute('aria-description')).toBe(false);
            });

            test('is set on the owner when nothing inside it is focusable', async () => {
                const owner = document.createElement('div');
                owner.textContent = 'Clickable text';
                await setupOwner(owner);

                await vi.waitFor(() => {
                    expect(owner?.getAttribute('aria-description')).toBe(
                        'About the owner'
                    );
                });
            });
        });

        describe('when the owner has disabled controls', () => {
            async function setupOwner(markup: string) {
                const { root, waitForChanges } = await render(<div />);
                const owner = document.createElement('div');
                owner.id = 'owner';
                const shadowRoot = owner.attachShadow({ mode: 'open' });
                shadowRoot.innerHTML = markup;
                const tooltip = document.createElement('limel-tooltip');
                tooltip.elementId = 'owner';
                tooltip.label = 'About the owner';
                root.append(owner, tooltip);
                await waitForChanges();

                return shadowRoot;
            }

            test('is set on an enabled control after a disabled one', async () => {
                const shadowRoot = await setupOwner(
                    '<button disabled>Off</button><button id="on">On</button>'
                );

                await vi.waitFor(() => {
                    expect(
                        shadowRoot
                            .querySelector('#on')
                            ?.getAttribute('aria-description')
                    ).toBe('About the owner');
                });
                expect(
                    shadowRoot
                        .querySelector('[disabled]')!
                        .hasAttribute('aria-description')
                ).toBe(false);
            });

            test('is set on an editable element, not on a non-editable one', async () => {
                const shadowRoot = await setupOwner(
                    '<div contenteditable="false">Fixed</div><div id="edit" contenteditable="true">Edit</div>'
                );

                await vi.waitFor(() => {
                    expect(
                        shadowRoot
                            .querySelector('#edit')
                            ?.getAttribute('aria-description')
                    ).toBe('About the owner');
                });
                expect(
                    shadowRoot
                        .querySelector('[contenteditable="false"]')!
                        .hasAttribute('aria-description')
                ).toBe(false);
            });

            test('is set on the disabled control when there is nothing else', async () => {
                const shadowRoot = await setupOwner(
                    '<button disabled>Off</button>'
                );

                await vi.waitFor(() => {
                    expect(
                        shadowRoot
                            .querySelector('button')
                            ?.getAttribute('aria-description')
                    ).toBe('About the owner');
                });
            });
        });

        test('is moved when the control inside the owner is replaced', async () => {
            const { root, waitForChanges } = await render(<div />);
            const owner = document.createElement('div');
            owner.id = 'owner';
            const shadowRoot = owner.attachShadow({ mode: 'open' });
            shadowRoot.innerHTML = '<button id="first">First</button>';
            const tooltip = document.createElement('limel-tooltip');
            tooltip.elementId = 'owner';
            tooltip.label = 'About the owner';
            root.append(owner, tooltip);
            await waitForChanges();

            const first = shadowRoot.querySelector('#first')!;
            await vi.waitFor(() => {
                expect(first.getAttribute('aria-description')).toBe(
                    'About the owner'
                );
            });

            shadowRoot.innerHTML = '<button id="second">Second</button>';
            tooltip.label = 'Still about the owner';
            await waitForChanges();

            const second = shadowRoot.querySelector('#second')!;
            await vi.waitFor(() => {
                expect(second.getAttribute('aria-description')).toBe(
                    'Still about the owner'
                );
            });
            expect(first.hasAttribute('aria-description')).toBe(false);
        });

        test('ends with the latest label when the label changes quickly', async () => {
            const { root, waitForChanges } = await render(
                <div>
                    <button id="owner">Save</button>
                    <limel-tooltip elementId="owner" label="First" />
                </div>
            );
            await waitForChanges();

            const tooltip = root.querySelector('limel-tooltip')!;
            tooltip.label = 'Second';
            tooltip.label = 'Third';
            await waitForChanges();

            await vi.waitFor(() => {
                expect(
                    root
                        .querySelector('button')!
                        .getAttribute('aria-description')
                ).toBe('Third');
            });
        });

        describe('when the element already has a description', () => {
            async function setupDescribed() {
                const { root, waitForChanges } = await render(
                    <div>
                        <button id="owner" aria-description="Existing">
                            Save
                        </button>
                        <limel-tooltip
                            elementId="owner"
                            label="About the owner"
                        />
                    </div>
                );
                await waitForChanges();

                return {
                    button: root.querySelector('button')!,
                    tooltip: root.querySelector('limel-tooltip')!,
                    waitForChanges,
                };
            }

            test('is replaced while the tooltip is there', async () => {
                const { button } = await setupDescribed();

                await vi.waitFor(() => {
                    expect(button.getAttribute('aria-description')).toBe(
                        'About the owner'
                    );
                });
            });

            test('is restored when the tooltip is removed', async () => {
                const { button, tooltip, waitForChanges } =
                    await setupDescribed();
                await vi.waitFor(() => {
                    expect(button.getAttribute('aria-description')).toBe(
                        'About the owner'
                    );
                });

                tooltip.remove();
                await waitForChanges();

                expect(button.getAttribute('aria-description')).toBe(
                    'Existing'
                );
            });

            test('is restored when the label only repeats the name', async () => {
                const { button, tooltip, waitForChanges } =
                    await setupDescribed();
                tooltip.label = 'Save';
                await waitForChanges();

                await vi.waitFor(() => {
                    expect(button.getAttribute('aria-description')).toBe(
                        'Existing'
                    );
                });
            });
        });

        test('is set on the control inside a host that passes the focus on, also when the host has a tabindex', async () => {
            const { root, waitForChanges } = await render(
                <div>
                    <limel-button id="owner" label="Save" tabIndex={0} />
                    <limel-tooltip
                        elementId="owner"
                        label="Persist the draft"
                    />
                </div>
            );
            await waitForChanges();

            const host = root.querySelector('limel-button')!;
            const button = host.shadowRoot!.querySelector('button');
            await vi.waitFor(() => {
                expect(button!.getAttribute('aria-description')).toBe(
                    'Persist the draft'
                );
            });
            expect(host.hasAttribute('aria-description')).toBe(false);
        });

        test('is set on an owner that contains its own tooltip, not on what is inside the tooltip', async () => {
            const { root, waitForChanges } = await render(
                <div id="owner">
                    <limel-tooltip elementId="owner" label="About the owner">
                        <button id="trap">Trap</button>
                    </limel-tooltip>
                </div>
            );
            await waitForChanges();

            await vi.waitFor(() => {
                expect(root.getAttribute('aria-description')).toBe(
                    'About the owner'
                );
            });
            expect(
                root.querySelector('#trap')!.hasAttribute('aria-description')
            ).toBe(false);
        });

        test('ignores a lookup that a newer lookup has replaced', async () => {
            const { root } = await render(<div />);
            const owner = document.createElement('div');
            owner.id = 'owner';
            const shadowRoot = owner.attachShadow({ mode: 'open' });
            const slowPart = document.createElement('slow-part');
            let finishSlowPart!: () => void;
            Object.assign(slowPart, {
                componentOnReady: () =>
                    new Promise<void>((resolve) => {
                        finishSlowPart = resolve;
                    }),
            });
            slowPart.attachShadow({ mode: 'open' }).innerHTML =
                '<button id="stale">Stale</button>';
            shadowRoot.append(slowPart);
            const tooltip = document.createElement('limel-tooltip');
            tooltip.elementId = 'owner';
            tooltip.label = 'First';
            root.append(owner, tooltip);
            await vi.waitFor(() => {
                expect(finishSlowPart).toBeDefined();
            });

            shadowRoot.innerHTML = '<button id="fresh">Fresh</button>';
            tooltip.label = 'Second';
            const fresh = shadowRoot.querySelector('#fresh')!;
            await vi.waitFor(() => {
                expect(fresh.getAttribute('aria-description')).toBe('Second');
            });

            finishSlowPart();
            await new Promise((resolve) => setTimeout(resolve, 50));

            expect(fresh.getAttribute('aria-description')).toBe('Second');
        });

        test('does not repeat what a chart row already says', async () => {
            const { root, waitForChanges } = await render(
                <limel-chart
                    type="doughnut"
                    displayItemPercentage={true}
                    items={[
                        { id: 1, text: 'Jan', value: 25 },
                        { id: 2, text: 'Feb', value: 75 },
                    ]}
                />
            );
            await waitForChanges();

            const row = root
                .shadowRoot!.querySelector('limel-tooltip')!
                .closest('tr')!;
            await vi.waitFor(() => {
                expect(row.getAttribute('aria-description')).toBe(
                    'Jan (25.00%)'
                );
            });
        });

        describe('when the description of the element is changed while the tooltip is there', () => {
            test('does not put the old description back when the tooltip is removed', async () => {
                const { root, waitForChanges } = await render(
                    <div>
                        <button id="owner" aria-description="Existing">
                            Save
                        </button>
                        <limel-tooltip
                            elementId="owner"
                            label="About the owner"
                        />
                    </div>
                );
                await waitForChanges();

                const button = root.querySelector('button')!;
                await vi.waitFor(() => {
                    expect(button.getAttribute('aria-description')).toBe(
                        'About the owner'
                    );
                });

                button.setAttribute('aria-description', 'Newer');
                root.querySelector('limel-tooltip')!.remove();
                await waitForChanges();

                expect(button.getAttribute('aria-description')).toBe('Newer');
            });

            test('keeps the text of another tooltip on the same element when one of them is removed', async () => {
                const { root, waitForChanges } = await render(
                    <div>
                        <button id="owner">Save</button>
                        <limel-tooltip elementId="owner" label="First" />
                        <limel-tooltip elementId="owner" label="Second" />
                    </div>
                );
                await waitForChanges();

                const button = root.querySelector('button')!;
                const tooltips = [...root.querySelectorAll('limel-tooltip')];
                await vi.waitFor(() => {
                    expect(
                        button.getAttribute('aria-description')
                    ).toBeTruthy();
                });

                const current = button.getAttribute('aria-description');
                const other = tooltips.find(
                    (tooltip) => tooltip.label !== current
                )!;
                other.remove();
                await waitForChanges();

                expect(button.getAttribute('aria-description')).toBe(current);
            });
        });

        describe('when several tooltips describe the same element', () => {
            async function setupTwoTooltips(existing?: string) {
                const { root, waitForChanges } = await render(
                    <div>
                        <button id="owner" aria-description={existing}>
                            Save
                        </button>
                        <limel-tooltip elementId="owner" label="First" />
                        <limel-tooltip elementId="owner" label="Second" />
                    </div>
                );
                await waitForChanges();

                const button = root.querySelector('button')!;
                const tooltips = [...root.querySelectorAll('limel-tooltip')];
                await vi.waitFor(() => {
                    expect(
                        button.getAttribute('aria-description')
                    ).toBeTruthy();
                });
                const current = button.getAttribute('aria-description');
                const currentTooltip = tooltips.find(
                    (t) => t.label === current
                )!;
                const other = tooltips.find((t) => t.label !== current)!;

                return {
                    button,
                    current: currentTooltip,
                    other,
                    waitForChanges,
                };
            }

            test('shows the text of the other tooltip when the one that is shown is removed', async () => {
                const { button, current, other, waitForChanges } =
                    await setupTwoTooltips();

                const otherText = other.label;
                current.remove();
                await waitForChanges();

                expect(button.getAttribute('aria-description')).toBe(otherText);
            });

            test('puts back the description from before when the last of them is removed', async () => {
                const { button, current, other, waitForChanges } =
                    await setupTwoTooltips('Existing');

                other.remove();
                await waitForChanges();
                current.remove();
                await waitForChanges();

                expect(button.getAttribute('aria-description')).toBe(
                    'Existing'
                );
            });
        });

        test('does not describe an element after the tooltip was removed while it looked for it', async () => {
            const { root } = await render(<div />);
            const owner = document.createElement('div');
            owner.id = 'owner';
            const shadowRoot = owner.attachShadow({ mode: 'open' });
            const slowPart = document.createElement('slow-part');
            let finishSlowPart!: () => void;
            Object.assign(slowPart, {
                componentOnReady: () =>
                    new Promise<void>((resolve) => {
                        finishSlowPart = resolve;
                    }),
            });
            slowPart.attachShadow({ mode: 'open' }).innerHTML =
                '<button id="stale">Stale</button>';
            shadowRoot.append(slowPart);
            const tooltip = document.createElement('limel-tooltip');
            tooltip.elementId = 'owner';
            tooltip.label = 'About the owner';
            root.append(owner, tooltip);
            await vi.waitFor(() => {
                expect(finishSlowPart).toBeDefined();
            });

            tooltip.remove();
            tooltip.elementId = 'missing';
            root.append(tooltip);
            finishSlowPart();
            await new Promise((resolve) => setTimeout(resolve, 50));

            expect(
                slowPart
                    .shadowRoot!.querySelector('#stale')!
                    .hasAttribute('aria-description')
            ).toBe(false);
        });

        test('is set on a focusable owner, not on the elements inside it', async () => {
            const { root, waitForChanges } = await render(<div />);
            const owner = document.createElement('div');
            owner.id = 'owner';
            owner.tabIndex = 0;
            owner.innerHTML = '<button>Inside</button>';
            const tooltip = document.createElement('limel-tooltip');
            tooltip.elementId = 'owner';
            tooltip.label = 'About the owner';
            root.append(owner, tooltip);
            await waitForChanges();

            await vi.waitFor(() => {
                expect(owner?.getAttribute('aria-description')).toBe(
                    'About the owner'
                );
            });
            expect(
                owner.querySelector('button')!.hasAttribute('aria-description')
            ).toBe(false);
        });
    });
});
