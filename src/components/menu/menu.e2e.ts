import { newE2EPage } from '@stencil/core/testing';
import { ListItem, ListSeparator } from '../list/list-item';

describe('limel-menu', async () => {
    let page;
    let limelMenu;
    let menuAnchor;
    let triggerSlot;
    let menu;
    let list;
    let items: Array<ListItem | ListSeparator>;
    beforeEach(async () => {
        page = await newE2EPage({
            html: '<limel-menu label="My Label"></limel-menu>',
        });
        limelMenu = await page.find('limel-menu');
        menuAnchor = await page.find('limel-menu>>>.mdc-menu-anchor');
        triggerSlot = await menuAnchor.find('slot[name=trigger]');
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
        limelMenu.setProperty('items', items);
        await page.waitForChanges();
        menu = await menuAnchor.find('.mdc-menu');
        list = await menu.find('.mdc-list');
    });
    it('renders the menu items', () => {
        expect(list.children).toHaveLength(5);
    });
    it('defaults to closed', async () => {
        const isOpen = await limelMenu.getProperty('open');
        expect(isOpen).toBe(false);
        expect(limelMenu).not.toHaveAttribute('open');
    });

    describe('menu element', () => {
        it('is not visible', () => {
            expect(menu).not.toHaveClass('mdc-menu--open');
            expect(list).toEqualAttribute('aria-hidden', 'true');
        });
    });

    describe('when property `open` is set to `true`', () => {
        beforeEach(async () => {
            limelMenu.setProperty('open', true);
            await page.waitForChanges();
        });
        it('is open', async () => {
            const isOpen = await limelMenu.getProperty('open');
            expect(isOpen).toBe(true);
            expect(limelMenu).toHaveAttribute('open');
        });

        describe('menu element', () => {
            it('is visible', () => {
                expect(menu).toHaveClass('mdc-menu--open');
                expect(list).toEqualAttribute('aria-hidden', 'false');
            });
        });
    });

    describe('default button', () => {
        let defaultButton;
        beforeEach(async () => {
            defaultButton = await triggerSlot.find('button');
        });
        it('has the correct class', () => {
            expect(defaultButton).toHaveClass('menu__trigger');
        });
        it('has the supplied label', () => {
            expect(defaultButton).toEqualText('My Label');
        });

        describe('when clicked', () => {
            beforeEach(async () => {
                await defaultButton.click();
                await page.waitForChanges();
            });
            it('opens the menu', async () => {
                const isOpen = await limelMenu.getProperty('open');
                expect(isOpen).toBe(true);
                expect(menu).toHaveClass('mdc-menu--open');
                expect(list).toEqualAttribute('aria-hidden', 'false');
            });

            describe('when the menu is already open', () => {
                beforeEach(async () => {
                    const isOpen = await limelMenu.getProperty('open');
                    expect(isOpen).toBe(true);
                    await defaultButton.click();
                    await page.waitForChanges();
                });
                it('closes the menu', async () => {
                    const isOpen = await limelMenu.getProperty('open');
                    expect(isOpen).toBeFalsy();
                    expect(menu).not.toHaveClass('mdc-menu--open');
                    expect(list).toEqualAttribute('aria-hidden', 'true');
                });
            });
        });

        describe('when property `disabled`', () => {
            describe('is not set', () => {
                it('is enabled', () => {
                    expect(defaultButton).not.toHaveAttribute('disabled');
                    expect(defaultButton).toHaveClass('menu__trigger-enabled');
                });
            });

            describe('is set', () => {
                beforeEach(async () => {
                    limelMenu.setProperty('disabled', true);
                    await page.waitForChanges();
                });
                it('is disabled', () => {
                    expect(defaultButton).toHaveAttribute('disabled');
                    expect(defaultButton).not.toHaveClass(
                        'menu__trigger-enabled'
                    );
                });

                describe('when default button is clicked', () => {
                    beforeEach(async () => {
                        await defaultButton.click();
                        await page.waitForChanges();
                    });
                    it('does NOT open the menu', async () => {
                        const isOpen = await limelMenu.getProperty('open');
                        expect(isOpen).toBeFalsy();
                        expect(menu).not.toHaveClass('mdc-menu--open');
                        expect(list).toEqualAttribute('aria-hidden', 'true');
                    });
                });
            });
        });
    });

    describe('menu item', () => {
        let spy;
        beforeEach(async () => {
            spy = await page.spyOnEvent('select');
            limelMenu.setProperty('open', true);
            await page.waitForChanges();
        });
        describe('when selected', () => {
            let item;
            beforeEach(async () => {
                item = await list.find('li');
                await item.click();
                await page.waitForChanges();
            });
            it.skip('emits the `select` event', () => {
                expect(spy).toHaveReceivedEventTimes(1);
            });
            it.skip('passes the selected item as the event details', () => {
                expect(spy).toHaveReceivedEventDetail(items[0]);
            });
            it('closes the menu', async () => {
                const isOpen = await limelMenu.getProperty('open');
                expect(isOpen).toBeFalsy();
                expect(menu).not.toHaveClass('mdc-menu--open');
                expect(list).toEqualAttribute('aria-hidden', 'true');
            });
        });
    });
});
