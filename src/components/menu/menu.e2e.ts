import { MenuItem, ListSeparator } from '@limetech/lime-elements';
import { newE2EPage, E2EPage, E2EElement } from '@stencil/core/testing';

describe('limel-menu', () => {
    let page: E2EPage;
    let limelMenu: HTMLLimelMenuElement & E2EElement;
    let items: Array<MenuItem | ListSeparator>;
    beforeEach(async () => {
        page = await newE2EPage({
            html: `
                <limel-menu>
                    <button slot="trigger">My Label</button>
                </limel-menu>
            `,
        });
        limelMenu = (await page.find('limel-menu')) as any;
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

    describe('button', () => {
        let defaultButton;
        beforeEach(async () => {
            defaultButton = await page.find('button[slot="trigger"]');
        });
        it('has the supplied label', () => {
            expect(defaultButton).toEqualText('My Label');
        });
        it('sets the correct aria attributes on the trigger element', async () => {
            expect(defaultButton.getAttribute('aria-haspopup')).toBeTruthy();
            expect(defaultButton.getAttribute('role')).toEqual('button');
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
            it('sets the correct aria attributes on the trigger element', async () => {
                expect(
                    defaultButton.getAttribute('aria-haspopup')
                ).toBeTruthy();
                expect(
                    defaultButton.getAttribute('aria-expanded')
                ).toBeTruthy();
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
                });
            });

            describe('is set', () => {
                beforeEach(async () => {
                    limelMenu.setProperty('disabled', true);
                    await page.waitForChanges();
                });
                it('is disabled', () => {
                    expect(defaultButton).toHaveAttribute('disabled');
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
                list = await page.find('limel-menu-list');
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
