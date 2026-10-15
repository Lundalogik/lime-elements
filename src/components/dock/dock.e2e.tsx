import { render, h } from '@stencil/vitest';
import { page } from 'vitest/browser';
import { DockItem } from './dock.types';

describe('limel-dock', () => {
    const dockItems: DockItem[] = [{ id: 'home', label: 'Home', icon: 'home' }];

    describe('the expand/shrink button', () => {
        const getButton = (name = 'Show navigation button labels') =>
            page.getByRole('button', { name: name });

        it('has an accessible name', async () => {
            const { waitForChanges } = await render(
                <limel-dock dockItems={dockItems} mobileBreakPoint={0} />
            );
            await waitForChanges();

            expect(getButton().query()).not.toBeNull();
        });

        it('has the name in the language of the dock', async () => {
            const { waitForChanges } = await render(
                <limel-dock
                    dockItems={dockItems}
                    mobileBreakPoint={0}
                    language="sv"
                />
            );
            await waitForChanges();

            const name = 'Visa etiketter på navigeringsknappar';
            expect(getButton(name).query()).not.toBeNull();
        });

        it('is not pressed when the dock is collapsed', async () => {
            const { waitForChanges } = await render(
                <limel-dock dockItems={dockItems} mobileBreakPoint={0} />
            );
            await waitForChanges();

            const button = getButton().element();
            expect(button.getAttribute('aria-pressed')).toBe('false');
        });

        it('is pressed when the dock is expanded', async () => {
            const { waitForChanges } = await render(
                <limel-dock
                    dockItems={dockItems}
                    mobileBreakPoint={0}
                    expanded={true}
                />
            );
            await waitForChanges();

            const button = getButton().element();
            expect(button.getAttribute('aria-pressed')).toBe('true');
        });

        it('is not described as expanding anything', async () => {
            const { waitForChanges } = await render(
                <limel-dock dockItems={dockItems} mobileBreakPoint={0} />
            );
            await waitForChanges();

            const button = getButton().element();
            expect(button.hasAttribute('aria-expanded')).toBe(false);
        });

        it('keeps its name and follows the dock when it is clicked', async () => {
            const { waitForChanges } = await render(
                <limel-dock dockItems={dockItems} mobileBreakPoint={0} />
            );
            await waitForChanges();

            getButton().element().click();
            await waitForChanges();
            expect(getButton().element().getAttribute('aria-pressed')).toBe(
                'true'
            );

            getButton().element().click();
            await waitForChanges();
            expect(getButton().element().getAttribute('aria-pressed')).toBe(
                'false'
            );
        });
    });

    it('switches layout when mobileBreakPoint changes', async () => {
        const { root, waitForChanges, setProps } = await render(
            <limel-dock dockItems={dockItems} mobileBreakPoint={0} />
        );
        await waitForChanges();
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(root.classList.contains('has-mobile-layout')).toBe(false);

        await setProps({ mobileBreakPoint: 100_000 });
        await waitForChanges();
        expect(root.classList.contains('has-mobile-layout')).toBe(true);

        await setProps({ mobileBreakPoint: 0 });
        await waitForChanges();
        expect(root.classList.contains('has-mobile-layout')).toBe(false);
    });

    describe('in the mobile layout', () => {
        const items: DockItem[] = [
            { id: 'home', label: 'Home', icon: 'home' },
            { id: 'search', label: 'Search', icon: 'search', badge: 3 },
            { id: 'create', label: 'Create new object', icon: 'plus_math' },
            { id: 'settings', label: 'Settings', icon: 'settings' },
            { id: 'help', label: 'Help and support', icon: 'help' },
        ];

        const renderDock = async (expanded: boolean, width = '20rem') => {
            const { root, waitForChanges } = await render(
                <div style={{ width }}>
                    <limel-dock
                        dockItems={items}
                        mobileBreakPoint={100_000}
                        expanded={expanded}
                        style={{ width: '100%' }}
                    />
                </div>
            );
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            const dock = root.querySelector('limel-dock');
            const buttons = [
                ...dock.shadowRoot.querySelectorAll('limel-dock-button'),
            ];

            return { dock, buttons };
        };

        const rect = (element: Element) => element.getBoundingClientRect();

        it('does not show the expand/shrink button', async () => {
            const { dock } = await renderDock(true);

            const button = dock.shadowRoot.querySelector(
                'button.expand-shrink'
            );
            expect(button).toBeNull();
        });

        it('shows the labels below the icons when expanded', async () => {
            const { buttons } = await renderDock(true);

            for (const button of buttons) {
                const icon = rect(button.querySelector('.icon'));
                const label = rect(button.querySelector('.text'));
                expect(label.height).toBeGreaterThan(0);
                expect(label.top).toBeGreaterThanOrEqual(icon.bottom);
            }
        });

        it('places the badge at the icon, not at the end of the wide item', async () => {
            const { buttons } = await renderDock(true, '40rem');

            const icon = rect(buttons[1].querySelector('.icon'));
            const badge = rect(buttons[1].querySelector('limel-badge'));
            const badgeCenter = badge.left + badge.width / 2;
            expect(Math.abs(badgeCenter - icon.right)).toBeLessThan(12);
        });

        it('hides the labels visually when not expanded', async () => {
            const { buttons } = await renderDock(false);

            for (const button of buttons) {
                const label = rect(button.querySelector('.text'));
                expect(label.width).toBe(0);
                expect(label.height).toBe(0);
            }
        });

        it('shares the width equally between the items when expanded', async () => {
            const { buttons } = await renderDock(true);

            const widths = buttons.map((button) => rect(button).width);
            expect(Math.min(...widths)).toBeGreaterThan(44);
            expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
        });

        it('truncates a label that does not fit', async () => {
            const { buttons } = await renderDock(true);

            const label = buttons[2].querySelector('.text');
            expect(label.clientWidth).toBeGreaterThan(0);
            expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
            expect(getComputedStyle(label).textOverflow).toBe('ellipsis');
        });

        describe('the width of the dock when expanded', () => {
            const getWidth = async (mobileBreakPoint: number) => {
                const { root, waitForChanges } = await render(
                    <limel-dock
                        dockItems={items}
                        mobileBreakPoint={mobileBreakPoint}
                        expanded={true}
                        style={{ '--dock-expanded-max-width': '100px' }}
                    />
                );
                await waitForChanges();
                await new Promise((resolve) => setTimeout(resolve, 100));

                return getComputedStyle(root).width;
            };

            it('follows --dock-expanded-max-width in the vertical layout', async () => {
                expect(await getWidth(0)).toBe('100px');
            });

            it('does not follow --dock-expanded-max-width', async () => {
                expect(await getWidth(100_000)).not.toBe('100px');
            });
        });
    });
});
