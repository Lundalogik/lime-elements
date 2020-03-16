import { ListItem, ListSeparator } from '@limetech/lime-elements';
import { newE2EPage } from '@stencil/core/testing';

describe('limel-menu', () => {
    let page;
    let limelMenu;
    let menuAnchor;
    let triggerSlot;
    let items: Array<ListItem | ListSeparator>;
    beforeEach(async () => {
        page = await newE2EPage({
            html: '<limel-menu label="My Label"></limel-menu>',
        });
        limelMenu = await page.find('limel-menu');
        menuAnchor = await page.find('limel-menu>>>.mdc-menu-surface--anchor');
        triggerSlot = await menuAnchor.find('slot[name=trigger]');
        items = [
            {
                text: 'My fab menu item',
                secondaryText: 'Absolutely the best item!',
                selected: false,
            },
        ];
        limelMenu.setProperty('items', items);
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
            let list;
            beforeEach(async () => {
                list = await page.find('limel-list');
                await list.click();
                await page.waitForChanges();
            });
            it('emits the `select` event', () => {
                expect(spy).toHaveReceivedEventTimes(1);
            });
            it('passes the selected item as the event details', () => {
                expect(spy).toHaveReceivedEventDetail(items[0]);
            });
            it('closes the menu', async () => {
                const isOpen = await limelMenu.getProperty('open');
                expect(isOpen).toBeFalsy();
            });
        });
    });
});
