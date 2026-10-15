import { render, h } from '@stencil/vitest';
import { page } from 'vitest/browser';
import { DockItem } from '../dock.types';

test('emits an event when dock menu is opened', async () => {
    const item: DockItem = {
        id: 'tables',
        label: 'Tables',
        icon: 'insert_table',
        dockMenu: {
            componentName: 'my-custom-menu',
        },
    };

    const { root, waitForChanges, spyOnEvent } = await render(
        <limel-dock-button item={item}></limel-dock-button>
    );
    const menuOpenSpy = spyOnEvent('menuOpen');
    await waitForChanges();

    const button = root.querySelector('.button') as HTMLButtonElement;
    button.click();
    await waitForChanges();
    expect(menuOpenSpy).toHaveReceivedEventTimes(1);
    expect(menuOpenSpy).toHaveReceivedEventDetail(item);
});

describe('accessible name', () => {
    const item: DockItem = {
        id: 'tables',
        label: 'Tables',
        icon: 'insert_table',
    };

    describe.each([
        ['collapsed', false],
        ['expanded', true],
    ])('when %s', (_, expanded) => {
        it('is the label of the item', async () => {
            const { waitForChanges } = await render(
                <limel-dock-button item={item} expanded={expanded} />
            );
            await waitForChanges();

            const button = page.getByRole('button', { name: 'Tables' });
            expect(button.query()).not.toBeNull();
        });

        it('includes the badge', async () => {
            const { waitForChanges } = await render(
                <limel-dock-button
                    item={{ ...item, badge: 3 }}
                    expanded={expanded}
                />
            );
            await waitForChanges();

            const button = page.getByRole('button', { name: /Tables\s*3/ });
            expect(button.query()).not.toBeNull();
        });
    });

    it('does not take up space in the collapsed layout', async () => {
        const { root, waitForChanges } = await render(
            <limel-dock-button item={item} expanded={false} />
        );
        await waitForChanges();

        const rect = root.querySelector('.text').getBoundingClientRect();
        expect(rect.width).toBe(0);
        expect(rect.height).toBe(0);
    });

    it('takes up space in the expanded layout', async () => {
        const { root, waitForChanges } = await render(
            <limel-dock-button item={item} expanded={true} />
        );
        await waitForChanges();

        const rect = root.querySelector('.text').getBoundingClientRect();
        expect(rect.width).toBeGreaterThan(0);
    });
});
