import { render, h } from '@stencil/vitest';

describe('limel-menu-list', () => {
    describe('without items', () => {
        it('renders an empty menu', async () => {
            const { root, waitForChanges } = await render(
                <limel-menu-list></limel-menu-list>
            );
            await waitForChanges();

            const innerList = root.shadowRoot.querySelector('ul');
            expect(innerList.classList.contains('mdc-deprecated-list')).toBe(
                true
            );
            expect(innerList.getAttribute('role')).toEqual('menu');

            const items = root.shadowRoot.querySelectorAll('limel-list-item');
            expect(items.length).toBe(0);
        });
    });

    describe('with an item', () => {
        it('renders a menu item', async () => {
            const { root, waitForChanges } = await render(
                <limel-menu-list items={[{ text: 'item 1' }]}></limel-menu-list>
            );
            await waitForChanges();

            const itemEl = root.shadowRoot.querySelector('limel-list-item');
            expect(itemEl.classList.contains('mdc-deprecated-list-item')).toBe(
                true
            );
            expect(itemEl.getAttribute('role')).toEqual('menuitem');
            expect(itemEl.getAttribute('tabindex')).toEqual('0');
            expect(itemEl.getAttribute('aria-disabled')).toEqual('false');
            expect(itemEl.getAttribute('text')).toEqual('item 1');
        });
    });

    describe('with a disabled item', () => {
        it('renders the item as disabled', async () => {
            const { root, waitForChanges } = await render(
                <limel-menu-list
                    items={[{ text: 'item 1', disabled: true }]}
                ></limel-menu-list>
            );
            await waitForChanges();

            const items = root.shadowRoot.querySelectorAll('limel-list-item');
            expect(items.length).toBe(1);
            expect(
                items[0].classList.contains('mdc-deprecated-list-item')
            ).toBe(true);
            expect(items[0].getAttribute('aria-disabled')).toEqual('true');
            expect(items[0].getAttribute('text')).toEqual('item 1');
        });
    });

    describe('with multiple items', () => {
        const items = [
            { text: 'item 1' },
            { separator: true },
            { text: 'item 3' },
            { text: 'item 4', disabled: true },
            { text: 'item 5' },
        ];

        it('renders the items and separators', async () => {
            const { root, waitForChanges } = await render(
                <limel-menu-list items={items}></limel-menu-list>
            );
            await waitForChanges();

            const itemEls = root.shadowRoot.querySelectorAll('limel-list-item');
            const separatorEls =
                root.shadowRoot.querySelectorAll('[role="separator"]');
            expect(itemEls.length).toBe(4);
            expect(separatorEls.length).toBe(1);
        });

        it('can render separators', async () => {
            const { root, waitForChanges } = await render(
                <limel-menu-list items={items}></limel-menu-list>
            );
            await waitForChanges();

            const separatorEl =
                root.shadowRoot.querySelector('[role="separator"]');
            expect(
                separatorEl.classList.contains('mdc-deprecated-list-divider')
            ).toBe(true);
            expect(separatorEl.getAttribute('role')).toEqual('separator');
        });

        it('gives each item the correct index', async () => {
            const { root, waitForChanges } = await render(
                <limel-menu-list items={items}></limel-menu-list>
            );
            await waitForChanges();

            const itemEls = root.shadowRoot.querySelectorAll('limel-list-item');
            expect(itemEls[0].dataset.index).toEqual('0');
            expect(itemEls[1].dataset.index).toEqual('2');
            expect(itemEls[2].dataset.index).toEqual('3');
            expect(itemEls[3].dataset.index).toEqual('4');
        });
    });

    describe('with at least one item with secondary text', () => {
        const items = [
            { text: 'item 1' },
            { separator: true },
            { text: 'item 3', secondaryText: 'some info' },
            { text: 'item 4', disabled: true },
            { text: 'item 5' },
        ];

        it('renders items WITHOUT secondary text as single line', async () => {
            const { root, waitForChanges } = await render(
                <limel-menu-list items={items}></limel-menu-list>
            );
            await waitForChanges();

            const itemEls = root.shadowRoot.querySelectorAll('limel-list-item');
            expect(itemEls[0].getAttribute('text')).toEqual('item 1');
            expect(itemEls[0].hasAttribute('secondary-text')).toBe(false);
        });

        it('renders items WITH secondary text via reflected attributes', async () => {
            const { root, waitForChanges } = await render(
                <limel-menu-list items={items}></limel-menu-list>
            );
            await waitForChanges();

            const itemEls = root.shadowRoot.querySelectorAll('limel-list-item');
            expect(itemEls[1].getAttribute('text')).toEqual('item 3');
            expect(itemEls[1].getAttribute('secondary-text')).toEqual(
                'some info'
            );
        });
    });
});
