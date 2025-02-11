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
        it('renders an empty menu', () => {
            expect(innerList).toHaveClass('mdc-deprecated-list');
            expect(innerList).toEqualAttribute('role', 'menu');
            expect(innerList.children).toHaveLength(0);
        });
    });

    describe('with an item', () => {
        let items: Array<MenuItem | ListSeparator>;
        beforeEach(async () => {
            items = [{ text: 'item 1' }];
            await limelList.setProperty('items', items);
            await page.waitForChanges();
        });
        it('renders a menu item', () => {
            expect(innerList.children).toHaveLength(1);
            expect(innerList.children[0]).toHaveClass(
                'mdc-deprecated-list-item',
            );
            expect(innerList.children[0]).toEqualAttribute('role', 'menuitem');
        });
        it('sets tabindex to 0', () => {
            expect(innerList.children[0]).toEqualAttribute('tabindex', '0');
        });
        it('sets the aria-disabled to false', () => {
            expect(innerList.children[0]).toEqualAttribute(
                'aria-disabled',
                'false',
            );
        });
        it('displays the correct text', () => {
            expect(innerList.children[0]).toEqualText('item 1');
        });
    });

    describe('with a disabled item', () => {
        let items: Array<MenuItem | ListSeparator>;
        beforeEach(async () => {
            items = [{ text: 'item 1', disabled: true }];
            await limelList.setProperty('items', items);
            await page.waitForChanges();
        });
        it('renders the item', () => {
            expect(innerList.children).toHaveLength(1);
            expect(innerList.children[0]).toHaveClass(
                'mdc-deprecated-list-item',
            );
        });
        it('does not set tabindex', () => {
            expect(innerList.children[0]).not.toHaveAttribute('tabindex');
        });
        it('sets the aria-disabled to true', () => {
            expect(innerList.children[0]).toEqualAttribute(
                'aria-disabled',
                'true',
            );
        });
        it('displays the correct text', () => {
            expect(innerList.children[0]).toEqualText('item 1');
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
        it('renders the items', () => {
            expect(innerList.children).toHaveLength(5);
        });
        it('can render separators', () => {
            expect(innerList.children[1]).toHaveClass(
                'mdc-deprecated-list-divider',
            );
            expect(innerList.children[1]).not.toHaveClass(
                'mdc-deprecated-list-item',
            );
            expect(innerList.children[1]).toEqualAttribute('role', 'separator');
        });
        it('gives each item the correct index', () => {
            expect(innerList.children[0]).toEqualAttribute('data-index', '0');
            // The separator doesn't get a data-index attribute,
            // but it *does* increment the index.
            expect(innerList.children[2]).toEqualAttribute('data-index', '2');
            expect(innerList.children[3]).toEqualAttribute('data-index', '3');
            expect(innerList.children[4]).toEqualAttribute('data-index', '4');
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
        it('renders a list with two-line items', () => {
            expect(innerList).toHaveClass('mdc-deprecated-list--two-line');
        });
        it('renders items withOUT secondary text as single line', () => {
            expect(innerList.children[0].children).toHaveLength(1);
            expect(innerList.children[0]).toEqualText('item 1');
        });
        it('renders items WITH secondary text as two lines', () => {
            expect(innerList.children[2].children).toHaveLength(1);
            expect(innerList.children[2].children[0]).toHaveClass(
                'mdc-deprecated-list-item__text',
            );
            expect(innerList.children[2].children[0].children).toHaveLength(2);
            expect(innerList.children[2].children[0].children[0]).toEqualText(
                'item 3',
            );
            expect(
                innerList.children[2].children[0].children[0].children[0],
            ).toHaveClass('mdc-deprecated-list-item__primary-text');
            expect(innerList.children[2].children[0].children[1]).toEqualText(
                'some info',
            );
            expect(innerList.children[2].children[0].children[1]).toHaveClass(
                'mdc-deprecated-list-item__secondary-text',
            );
        });
        it('can render separators', () => {
            expect(innerList.children[1]).toHaveClass(
                'mdc-deprecated-list-divider',
            );
            expect(innerList.children[1]).not.toHaveClass(
                'mdc-deprecated-list-item',
            );
            expect(innerList.children[1]).toEqualAttribute('role', 'separator');
        });
        it('gives each item the correct index', () => {
            expect(innerList.children[0]).toEqualAttribute('data-index', '0');
            // The separator doesn't get a data-index attribute,
            // but it *does* increment the index.
            expect(innerList.children[2]).toEqualAttribute('data-index', '2');
            expect(innerList.children[3]).toEqualAttribute('data-index', '3');
            expect(innerList.children[4]).toEqualAttribute('data-index', '4');
        });
    });
});
