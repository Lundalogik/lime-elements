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

    const button = root.querySelector('button') as HTMLButtonElement;
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

describe('current item', () => {
    const item: DockItem = {
        id: 'tables',
        label: 'Tables',
        icon: 'insert_table',
    };

    const getButton = () => page.getByRole('button', { name: 'Tables' });

    it('is marked as the current page when it is selected', async () => {
        const { waitForChanges } = await render(
            <limel-dock-button item={{ ...item, selected: true }} />
        );
        await waitForChanges();

        expect(getButton().element().getAttribute('aria-current')).toBe('page');
    });

    it('is not marked when it is not selected', async () => {
        const { waitForChanges } = await render(
            <limel-dock-button item={item} />
        );
        await waitForChanges();

        expect(getButton().element().hasAttribute('aria-current')).toBe(false);
    });

    it('follows the selected state of the item', async () => {
        const { waitForChanges, setProps } = await render(
            <limel-dock-button item={item} />
        );
        await waitForChanges();

        await setProps({ item: { ...item, selected: true } });
        expect(getButton().element().getAttribute('aria-current')).toBe('page');

        await setProps({ item: { ...item, selected: false } });
        expect(getButton().element().hasAttribute('aria-current')).toBe(false);
    });

    it('is marked when the item opens a menu', async () => {
        const menuItem: DockItem = {
            ...item,
            selected: true,
            dockMenu: { componentName: 'my-custom-menu' },
        };
        const { waitForChanges } = await render(
            <limel-dock-button item={menuItem} />
        );
        await waitForChanges();

        expect(getButton().element().getAttribute('aria-current')).toBe('page');
    });

    describe('styling', () => {
        const selectedColor = 'rgb(255, 0, 0)';
        const style = {
            '--dock-item-background-color--selected': selectedColor,
        };

        const getBackground = () =>
            getComputedStyle(getButton().element()).backgroundColor;

        it('looks selected when it is the current page', async () => {
            const { waitForChanges } = await render(
                <limel-dock-button
                    item={{ ...item, selected: true }}
                    style={style}
                />
            );
            await waitForChanges();

            expect(getBackground()).toBe(selectedColor);
        });

        it('does not look selected otherwise', async () => {
            const { waitForChanges } = await render(
                <limel-dock-button item={item} style={style} />
            );
            await waitForChanges();

            expect(getBackground()).not.toBe(selectedColor);
        });
    });
});
