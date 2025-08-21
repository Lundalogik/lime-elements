import { MenuItem, ListSeparator } from '@limetech/lime-elements';
import { newE2EPage } from '@stencil/core/testing';

describe('limel-menu-list', () => {
    let page;
    let limelList;
    let innerList;
    beforeEach(async () => {
        page = await newE2EPage({
            html: '<limel-menu-list></limel-menu-list>',
        });
        limelList = await page.find('limel-menu-list');
        innerList = await page.find('limel-menu-list>>>ul');
    });

    describe('without items', () => {
        it('renders an empty menu', async () => {
            expect(innerList).toHaveClass('mdc-deprecated-list');
            expect(innerList).toEqualAttribute('role', 'menu');
            const items = await page.findAll(
                'limel-menu-list>>>limel-list-item'
            );
            expect(items).toHaveLength(0);
        });
    });

    describe('with an item', () => {
        let items: Array<MenuItem | ListSeparator>;
        beforeEach(async () => {
            items = [{ text: 'item 1' }];
            await limelList.setProperty('items', items);
            await page.waitForChanges();
        });
        it('renders a menu item', async () => {
            const itemEl = await page.find('limel-menu-list>>>limel-list-item');
            expect(itemEl).toHaveClass('mdc-deprecated-list-item');
            expect(itemEl).toEqualAttribute('role', 'menuitem');
        });
        it('sets tabindex to 0', async () => {
            const itemEl = await page.find('limel-menu-list>>>limel-list-item');
            expect(itemEl).toEqualAttribute('tabindex', '0');
        });
        it('sets the aria-disabled to false', async () => {
            const itemEl = await page.find('limel-menu-list>>>limel-list-item');
            expect(itemEl).toEqualAttribute('aria-disabled', 'false');
        });
        it('displays the correct text', async () => {
            const itemEl = await page.find('limel-menu-list>>>limel-list-item');
            expect(itemEl).toEqualAttribute('text', 'item 1');
        });
    });

    describe('with a disabled item', () => {
        let items: Array<MenuItem | ListSeparator>;
        beforeEach(async () => {
            items = [{ text: 'item 1', disabled: true }];
            await limelList.setProperty('items', items);
            await page.waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 0));
        });
        it('renders the item', async () => {
            const itemsEls = await page.findAll(
                'limel-menu-list>>>limel-list-item'
            );
            expect(itemsEls).toHaveLength(1);
            expect(itemsEls[0]).toHaveClass('mdc-deprecated-list-item');
        });
        it('does not set tabindex', async () => {
            const itemEl = await page.find('limel-menu-list>>>limel-list-item');
            expect(itemEl).not.toHaveAttribute('tabindex');
        });
        it('sets the aria-disabled to true', async () => {
            const itemEl = await page.find('limel-menu-list>>>limel-list-item');
            expect(itemEl).toEqualAttribute('aria-disabled', 'true');
        });
        it('displays the correct text', async () => {
            const itemEl = await page.find('limel-menu-list>>>limel-list-item');
            expect(itemEl).toEqualAttribute('text', 'item 1');
        });
    });

    describe('with multiple items', () => {
        let items: Array<MenuItem | ListSeparator>;
        beforeEach(async () => {
            items = [
                { text: 'item 1' },
                { separator: true },
                { text: 'item 3' },
                {
                    text: 'item 4',
                    disabled: true,
                },
                { text: 'item 5' },
            ];
            await limelList.setProperty('items', items);
            await page.waitForChanges();
        });
        it('renders the items', async () => {
            const itemEls = await page.findAll(
                'limel-menu-list>>>limel-list-item'
            );
            const separatorEls = await page.findAll(
                'limel-menu-list>>>[role="separator"]'
            );
            expect(itemEls).toHaveLength(4);
            expect(separatorEls).toHaveLength(1);
        });
        it('can render separators', async () => {
            const separatorEl = await page.find(
                'limel-menu-list>>>[role="separator"]'
            );
            expect(separatorEl).toHaveClass('mdc-deprecated-list-divider');
            expect(separatorEl).not.toHaveClass('mdc-deprecated-list-item');
            expect(separatorEl).toEqualAttribute('role', 'separator');
        });
        it('gives each item the correct index', async () => {
            const itemEls = await page.findAll(
                'limel-menu-list>>>limel-list-item'
            );
            expect(itemEls[0]).toEqualAttribute('data-index', '0');
            // The separator doesn't get a data-index attribute,
            // but it *does* increment the index for following items.
            expect(itemEls[1]).toEqualAttribute('data-index', '2');
            expect(itemEls[2]).toEqualAttribute('data-index', '3');
            expect(itemEls[3]).toEqualAttribute('data-index', '4');
        });
    });

    describe('with at least one item with secondary text', () => {
        let items: Array<MenuItem | ListSeparator>;
        beforeEach(async () => {
            items = [
                { text: 'item 1' },
                { separator: true },
                {
                    text: 'item 3',
                    secondaryText: 'some info',
                },
                {
                    text: 'item 4',
                    disabled: true,
                },
                { text: 'item 5' },
            ];
            await limelList.setProperty('items', items);
            await page.waitForChanges();
        });
        it('renders items WITHOUT secondary text as single line', async () => {
            const itemEls = await page.findAll(
                'limel-menu-list>>>limel-list-item'
            );
            expect(itemEls[0]).toEqualAttribute('text', 'item 1');
            expect(itemEls[0]).not.toHaveAttribute('secondary-text');
        });
        it('renders items WITH secondary text via reflected attributes', async () => {
            const itemEls = await page.findAll(
                'limel-menu-list>>>limel-list-item'
            );
            // itemEls[1] corresponds to original index 2 (after a separator)
            expect(itemEls[1]).toEqualAttribute('text', 'item 3');
            expect(itemEls[1]).toEqualAttribute('secondary-text', 'some info');
        });
        it('can render separators', async () => {
            const separatorEl = await page.find(
                'limel-menu-list>>>[role="separator"]'
            );
            expect(separatorEl).toHaveClass('mdc-deprecated-list-divider');
            expect(separatorEl).not.toHaveClass('mdc-deprecated-list-item');
            expect(separatorEl).toEqualAttribute('role', 'separator');
        });
        it('gives each item the correct index', async () => {
            const itemEls = await page.findAll(
                'limel-menu-list>>>limel-list-item'
            );
            expect(itemEls[0]).toEqualAttribute('data-index', '0');
            // The separator doesn't get a data-index attribute,
            // but it *does* increment the index for following items.
            expect(itemEls[1]).toEqualAttribute('data-index', '2');
            expect(itemEls[2]).toEqualAttribute('data-index', '3');
            expect(itemEls[3]).toEqualAttribute('data-index', '4');
        });
    });
});
