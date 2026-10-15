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
});
