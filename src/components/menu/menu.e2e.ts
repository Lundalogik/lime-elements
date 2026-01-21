import { MenuItem, ListSeparator } from '@limetech/lime-elements';
import { newE2EPage, E2EPage, E2EElement } from '@stencil/core/testing';

const waitForActiveElementSlot = async (
    page: E2EPage,
    expectedSlot: string,
    timeout = 1000
) => {
    const anyPage = page as any;
    if (typeof anyPage.waitForFunction === 'function') {
        await anyPage.waitForFunction(
            (slot: string) =>
                (document.activeElement as HTMLElement | null)?.getAttribute(
                    'slot'
                ) === slot,
            { timeout },
            expectedSlot
        );

        return;
    }

    const start = Date.now();
    while (Date.now() - start < timeout) {
        const slot = await page.evaluate(() =>
            (document.activeElement as HTMLElement | null)?.getAttribute('slot')
        );
        if (slot === expectedSlot) {
            return;
        }

        await page.waitForTimeout(0);
    }

    throw new Error(
        `Timed out waiting for activeElement slot '${expectedSlot}'`
    );
};

const waitForMenuOpenState = async (
    page: E2EPage,
    open: boolean,
    timeout = 1000
) => {
    const anyPage = page as any;
    if (typeof anyPage.waitForFunction === 'function') {
        await anyPage.waitForFunction(
            (isOpen: boolean) => {
                const menu = document.querySelector('limel-menu');
                return menu?.hasAttribute('open') === isOpen;
            },
            { timeout },
            open
        );

        return;
    }

    const start = Date.now();
    while (Date.now() - start < timeout) {
        const isOpen = await page.evaluate(
            () =>
                document.querySelector('limel-menu')?.hasAttribute('open') ??
                false
        );
        if (isOpen === open) {
            return;
        }

        await page.waitForTimeout(0);
    }

    throw new Error(`Timed out waiting for menu open=${String(open)}`);
};

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

            const trigger = await page.find('button[slot="trigger"]');
            await trigger.click();
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

            it('restores focus to the trigger', async () => {
                await waitForActiveElementSlot(page, 'trigger');
                const activeSlot = await page.evaluate(() =>
                    (
                        document.activeElement as HTMLElement | null
                    )?.getAttribute('slot')
                );
                expect(activeSlot).toBe('trigger');
            });
        });
    });
});

describe('limel-menu focus restoration', () => {
    it('restores focus to a limel-button trigger after selection', async () => {
        const page = await newE2EPage({
            html: `
                <limel-menu>
                    <limel-button slot="trigger" label="My Label"></limel-button>
                </limel-menu>
            `,
        });

        const limelMenu = (await page.find('limel-menu')) as any;
        const items: Array<MenuItem | ListSeparator> = [{ text: 'Item 1' }];
        limelMenu.setProperty('items', items);
        await page.waitForChanges();

        const trigger = await page.find('limel-button[slot="trigger"]');
        await trigger.click();
        await page.waitForChanges();

        const list = await page.find('limel-menu-list');
        await list.click();
        await page.waitForChanges();

        await waitForActiveElementSlot(page, 'trigger');

        const activeSlot = await page.evaluate(() =>
            (document.activeElement as HTMLElement | null)?.getAttribute('slot')
        );
        expect(activeSlot).toBe('trigger');
    });

    it('restores focus to a native trigger after Escape', async () => {
        const page = await newE2EPage({
            html: `
                <limel-menu>
                    <button slot="trigger">My Label</button>
                </limel-menu>
            `,
        });

        const limelMenu = (await page.find('limel-menu')) as any;
        const items: Array<MenuItem | ListSeparator> = [{ text: 'Item 1' }];
        limelMenu.setProperty('items', items);
        await page.waitForChanges();

        const trigger = await page.find('button[slot="trigger"]');
        await trigger.click();
        await page.waitForChanges();

        await waitForMenuOpenState(page, true);

        await page.keyboard.press('Escape');
        await page.waitForChanges();

        await waitForMenuOpenState(page, false);
        await waitForActiveElementSlot(page, 'trigger');

        const isOpen = await limelMenu.getProperty('open');
        expect(isOpen).toBeFalsy();

        const activeSlot = await page.evaluate(() =>
            (document.activeElement as HTMLElement | null)?.getAttribute('slot')
        );
        expect(activeSlot).toBe('trigger');
    });

    it('restores focus to a limel-button trigger after Escape key is pressed', async () => {
        const page = await newE2EPage({
            html: `
                <limel-menu>
                    <limel-button slot="trigger" label="My Label"></limel-button>
                </limel-menu>
            `,
        });

        const limelMenu = (await page.find('limel-menu')) as any;
        const items: Array<MenuItem | ListSeparator> = [{ text: 'Item 1' }];
        limelMenu.setProperty('items', items);
        await page.waitForChanges();

        const trigger = await page.find('limel-button[slot="trigger"]');
        await trigger.click();
        await page.waitForChanges();

        await waitForMenuOpenState(page, true);

        await page.keyboard.press('Escape');
        await page.waitForChanges();

        await waitForMenuOpenState(page, false);
        await waitForActiveElementSlot(page, 'trigger');

        const isOpen = await limelMenu.getProperty('open');
        expect(isOpen).toBeFalsy();

        const activeSlot = await page.evaluate(() =>
            (document.activeElement as HTMLElement | null)?.getAttribute('slot')
        );
        expect(activeSlot).toBe('trigger');
    });
});

describe('limel-menu keyboard navigation', () => {
    describe('with nested items (sub-menus)', () => {
        let page: E2EPage;
        let limelMenu: HTMLLimelMenuElement & E2EElement;

        beforeEach(async () => {
            page = await newE2EPage({
                html: `
                    <limel-menu>
                        <button slot="trigger">Open Menu</button>
                    </limel-menu>
                `,
            });
            limelMenu = (await page.find('limel-menu')) as any;
            const items = [
                {
                    text: 'Parent Item',
                    items: [{ text: 'Child Item 1' }, { text: 'Child Item 2' }],
                },
                { text: 'Another Item' },
            ];
            await limelMenu.setProperty('items', items);
            await page.waitForChanges();
        });

        it('right arrow on item with sub-menu emits navigateMenu', async () => {
            // Click the trigger button to open the menu (this sets up proper focus)
            const trigger = await page.find('button');
            await trigger.click();
            await page.waitForChanges();
            await page.waitForTimeout(300);

            const navigateMenuSpy = await page.spyOnEvent('navigateMenu');

            // Press right arrow to navigate into sub-menu (first item is focused by default)
            await page.keyboard.press('ArrowRight');
            await page.waitForChanges();
            await page.waitForTimeout(100);

            expect(navigateMenuSpy).toHaveReceivedEvent();
        });

        it('left arrow in sub-menu goes back to parent', async () => {
            // Click to open the menu
            const trigger = await page.find('button');
            await trigger.click();
            await page.waitForChanges();
            await page.waitForTimeout(300);

            // Enter sub-menu with ArrowRight
            await page.keyboard.press('ArrowRight');
            await page.waitForChanges();
            await page.waitForTimeout(200);

            // Verify we're in sub-menu
            let currentSubMenu = await limelMenu.getProperty('currentSubMenu');
            expect(currentSubMenu).not.toBeNull();

            // Press left to go back
            await page.keyboard.press('ArrowLeft');
            await page.waitForChanges();
            await page.waitForTimeout(100);

            // Verify we're back at root
            currentSubMenu = await limelMenu.getProperty('currentSubMenu');
            expect(currentSubMenu).toBeNull();
        });

        it('breadcrumbs visible when in sub-menu', async () => {
            // Click to open the menu
            const trigger = await page.find('button');
            await trigger.click();
            await page.waitForChanges();
            await page.waitForTimeout(300);

            // Navigate into sub-menu
            await page.keyboard.press('ArrowRight');
            await page.waitForChanges();
            await page.waitForTimeout(300);

            // Verify we're actually in the sub-menu
            const currentSubMenu =
                await limelMenu.getProperty('currentSubMenu');
            expect(currentSubMenu).not.toBeNull();

            // Breadcrumbs are rendered in a portal (outside the menu's shadow DOM)
            // so we need to look for them in the document
            const breadcrumbsExists = await page.evaluate(() => {
                // First try looking in the portal container
                const portalContainer = document.querySelector(
                    '.limel-portal--container'
                );
                if (
                    portalContainer?.querySelector(
                        'limel-breadcrumbs, [class*="breadcrumb"]'
                    )
                ) {
                    return true;
                }

                // Check inside limel-menu-surface
                const menuSurface =
                    document.querySelector('limel-menu-surface');
                if (menuSurface) {
                    const breadcrumbs =
                        menuSurface.querySelector('limel-breadcrumbs');
                    if (breadcrumbs) {
                        return true;
                    }
                }

                // Also check if breadcrumbs exist anywhere in the document
                return document.querySelector('limel-breadcrumbs') !== null;
            });
            expect(breadcrumbsExists).toBe(true);
        });
    });

    describe('without searcher (no input field)', () => {
        let page: E2EPage;
        let limelMenu: HTMLLimelMenuElement & E2EElement;

        beforeEach(async () => {
            page = await newE2EPage({
                html: `
                    <limel-menu>
                        <button slot="trigger">Open Menu</button>
                    </limel-menu>
                `,
            });
            limelMenu = (await page.find('limel-menu')) as any;
            const items = [
                { text: 'Item 1' },
                { text: 'Item 2' },
                { text: 'Item 3' },
            ];
            await limelMenu.setProperty('items', items);
            await page.waitForChanges();
        });

        it('no input field when no searcher is set', async () => {
            const trigger = await page.find('button');
            await trigger.click();
            await page.waitForChanges();
            await page.waitForTimeout(200);

            const inputExists = await page.evaluate(() => {
                const menu = document.querySelector('limel-menu');
                const inputField =
                    menu?.shadowRoot?.querySelector('limel-input-field');

                return inputField !== null;
            });
            expect(inputExists).toBe(false);
        });

        it('focus wraps within list items when no input field', async () => {
            const trigger = await page.find('button');
            await trigger.click();
            await page.waitForChanges();
            await page.waitForTimeout(200);

            // Navigate down from first item (Item 1 -> Item 2 -> Item 3)
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowDown');
            await page.waitForChanges();
            await page.waitForTimeout(50);

            // Press down once more - should wrap to first item (Item 3 -> Item 1)
            await page.keyboard.press('ArrowDown');
            await page.waitForChanges();
            await page.waitForTimeout(50);

            const firstItemFocused = await page.evaluate(() => {
                const menu = document.querySelector('limel-menu');
                const menuList =
                    menu?.shadowRoot?.querySelector('limel-menu-list');
                const listItems = menuList?.shadowRoot?.querySelectorAll(
                    '.mdc-deprecated-list-item'
                );
                const firstItem = listItems?.[0];

                return firstItem === menuList?.shadowRoot?.activeElement;
            });
            expect(firstItemFocused).toBe(true);
        });
    });
});
