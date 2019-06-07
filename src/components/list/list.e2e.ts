import { newE2EPage } from '@stencil/core/testing';
import { ListItem, ListSeparator } from '../../interface';

describe('limel-list', () => {
    let page;
    let limelList;
    let innerList;
    beforeEach(async () => {
        page = await newE2EPage({ html: '<limel-list></limel-list>' });
        limelList = await page.find('limel-list');
        innerList = await page.find('limel-list>>>ul');
    });

    describe('without items', () => {
        it('renders an empty listbox', () => {
            expect(innerList).toHaveClass('mdc-list');
            expect(innerList).not.toHaveClass('mdc-menu__items');
            expect(innerList).toEqualAttribute('role', 'listbox');
            expect(innerList.children).toHaveLength(0);
        });
    });

    describe('with an item', () => {
        let items: Array<ListItem | ListSeparator>;
        beforeEach(async () => {
            items = [{ text: 'item 1' }];
            await limelList.setProperty('items', items);
            await page.waitForChanges();
        });
        it('renders the item', () => {
            expect(innerList.children).toHaveLength(1);
            expect(innerList.children[0]).toHaveClass('mdc-list-item');
        });
        it('does not render a menu-item', () => {
            expect(innerList.children[0]).not.toEqualAttribute(
                'role',
                'menuitem'
            );
        });
        it('sets tabindex to 0', () => {
            expect(innerList.children[0]).toEqualAttribute('tabindex', '0');
        });
        it('sets the aria-disabled to false', () => {
            expect(innerList.children[0]).toEqualAttribute(
                'aria-disabled',
                'false'
            );
        });
        it('displays the correct text', () => {
            expect(innerList.children[0]).toEqualText('item 1');
        });
    });

    describe('with a disabled item', () => {
        let items: Array<ListItem | ListSeparator>;
        beforeEach(async () => {
            items = [{ text: 'item 1', disabled: true }];
            await limelList.setProperty('items', items);
            await page.waitForChanges();
        });
        it('renders the item', () => {
            expect(innerList.children).toHaveLength(1);
            expect(innerList.children[0]).toHaveClass('mdc-list-item');
        });
        it('sets tabindex to -1', () => {
            expect(innerList.children[0]).toEqualAttribute('tabindex', '-1');
        });
        it('sets the aria-disabled to true', () => {
            expect(innerList.children[0]).toEqualAttribute(
                'aria-disabled',
                'true'
            );
        });
        it('displays the correct text', () => {
            expect(innerList.children[0]).toEqualText('item 1');
        });
    });

    describe('with multiple items', () => {
        let items: Array<ListItem | ListSeparator>;
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
            expect(innerList.children[1]).toHaveClass('mdc-list-divider');
            expect(innerList.children[1]).not.toHaveClass('mdc-list-item');
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
        let items: Array<ListItem | ListSeparator>;
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
            expect(innerList).toHaveClass('mdc-list--two-line');
        });
        it('renders items withOUT secondary text as single line', () => {
            expect(innerList.children[0].children).toHaveLength(0);
            expect(innerList.children[0]).toEqualText('item 1');
        });
        it('renders items WITH secondary text as two lines', () => {
            expect(innerList.children[2].children).toHaveLength(1);
            expect(innerList.children[2].children[0]).toHaveClass(
                'mdc-list-item__text'
            );
            expect(innerList.children[2].children[0].children).toHaveLength(2);
            expect(innerList.children[2].children[0].children[0]).toEqualText(
                'item 3'
            );
            expect(innerList.children[2].children[0].children[0]).toHaveClass(
                'mdc-list-item__primary-text'
            );
            expect(innerList.children[2].children[0].children[1]).toEqualText(
                'some info'
            );
            expect(innerList.children[2].children[0].children[1]).toHaveClass(
                'mdc-list-item__secondary-text'
            );
        });
        it('can render separators', () => {
            expect(innerList.children[1]).toHaveClass('mdc-list-divider');
            expect(innerList.children[1]).not.toHaveClass('mdc-list-item');
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

    describe('when the attribute `type`', () => {
        describe('is not set', () => {
            it('is not selectable', () => {
                expect(innerList).not.toHaveClass('selectable');
            });
        });

        describe('is set as `selectable`', () => {
            let items;
            beforeEach(async () => {
                page = await newE2EPage({
                    html: '<limel-list type="selectable"></limel-list>',
                });
                limelList = await page.find('limel-list');
                innerList = await page.find('limel-list>>>ul');
                items = [{ text: 'item 1' }];
                await limelList.setProperty('items', items);
                await page.waitForChanges();
            });
            it('is selectable', () => {
                expect(innerList).toHaveClass('selectable');
            });
            it('has the value `selectable`', async () => {
                const propValue = await limelList.getProperty('type');
                expect(propValue).toBe('selectable');
            });
            describe('the `change` event', () => {
                let spy;
                beforeEach(async () => {
                    spy = await page.spyOnEvent('change');
                });
                describe('when an item is selected', () => {
                    let item;
                    beforeEach(async () => {
                        item = await innerList.find('li');
                        await item.click();
                        await page.waitFor(20); // Give the event a chance to bubble.
                    });
                    it('is emitted', () => {
                        expect(spy).toHaveReceivedEventTimes(1);
                    });
                    it('passes the selected item as the event details', () => {
                        expect(spy).toHaveReceivedEventDetail({
                            ...items[0],
                            selected: true,
                        });
                    });
                });
            });
        });
    });
});
