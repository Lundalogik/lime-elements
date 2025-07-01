import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { ListSeparator } from '../list/list-item.types';
import { MenuItem } from '../menu/menu.types';

describe('limel-split-button', () => {
    let page: E2EPage;
    let splitButton: E2EElement;
    let limelButton: E2EElement;
    let limelMenu: E2EElement;

    describe('with a label', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-split-button label="Save"></limel-split-button>
            `);
            splitButton = await page.find('limel-split-button');
            limelButton = await page.find('limel-split-button>>>limel-button');
        });

        it('inner limel-button displays the correct label', () => {
            expect(limelButton.getAttribute('label')).toEqualText('Save');
        });

        describe('when changing the label', () => {
            beforeEach(async () => {
                splitButton.setProperty('label', 'new Label');
                await page.waitForChanges();
            });
            it('inner limel-button renders the new label', () => {
                expect(limelButton.getAttribute('label')).toEqualText(
                    'new Label'
                );
            });
        });
    });

    describe('when the attribute "primary"', () => {
        describe('is not set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    <limel-split-button></limel-split-button>
                `);

                limelButton = await page.find(
                    'limel-split-button>>>limel-button'
                );
            });

            it('the inner button is not "primary"', async () => {
                const propValue = await limelButton.getProperty('primary');
                expect(propValue).toBeFalsy();
            });
        });

        describe('is set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    '<limel-split-button primary></limel-split-button>
                `);

                limelButton = await page.find(
                    'limel-split-button>>>limel-button'
                );
            });

            it('the inner button is "primary"', async () => {
                const propValue = await limelButton.getProperty('primary');
                expect(propValue).toBe(true);
            });
        });
    });

    describe('when the attribute "disabled"', () => {
        describe('is not set', () => {
            beforeEach(async () => {
                page = await createPage(`
                     <limel-split-button></limel-split-button>
                `);

                limelButton = await page.find(
                    'limel-split-button>>>limel-button'
                );
            });

            it('the inner button is not disabled', async () => {
                const propValue = await limelButton.getProperty('disabled');
                expect(propValue).toBeFalsy();
            });
        });

        describe('is set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    <limel-split-button disabled></limel-split-button>
                `);

                limelButton = await page.find(
                    'limel-split-button>>>limel-button'
                );
            });

            it('the inner button is disabled', async () => {
                const propValue = await limelButton.getProperty('disabled');
                expect(propValue).toBe(true);
            });
        });
    });

    describe('when the attribute `icon`', () => {
        describe('is not set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    <limel-split-button></limel-split-button>
                `);

                limelButton = await page.find(
                    'limel-split-button>>>limel-button'
                );
            });

            it('inner limel-button renders no icon', async () => {
                const propValue = await limelButton.getProperty('icon');
                expect(propValue).toBeFalsy();
            });
        });

        describe('is set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    '<limel-split-button icon="unit-test"></limel-split-button>
                `);

                limelButton = await page.find(
                    'limel-split-button>>>limel-button'
                );
            });

            it('inner limel-button renders the icon "unit-test"', async () => {
                const propValue = await limelButton.getProperty('icon');
                expect(propValue).toBe('unit-test');
            });
        });
    });

    describe('when the attribute `items`', () => {
        describe('is not set', () => {
            beforeEach(async () => {
                page = await createPage(`
                    <limel-split-button></limel-split-button>
                `);

                limelMenu = await page.find('limel-split-button>>>limel-menu');
            });

            it('limel-menu is not displayed', async () => {
                expect(limelMenu).toEqual(null);
            });
        });

        describe('is set', () => {
            const items: Array<ListSeparator | MenuItem> = [
                { text: 'Later today', secondaryText: 'at 16:45' },
                { text: 'Tomorrow', secondaryText: 'at 08:00' },
            ];
            beforeEach(async () => {
                page = await createPage(`
                    <limel-split-button class="has-menu"></limel-split-button>
                `);

                splitButton = await page.find('limel-split-button');
                splitButton.setProperty('items', items);

                await page.waitForChanges();

                limelMenu = await page.find('limel-split-button>>>limel-menu');
            });

            it('limel-menu displays the values', async () => {
                const propValue = await limelMenu.getProperty('items');
                expect(propValue).toEqual(items);
            });
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}
