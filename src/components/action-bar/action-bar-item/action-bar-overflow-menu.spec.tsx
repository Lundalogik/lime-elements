import { h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { ActionBarItem, ListSeparator } from '@limetech/lime-elements';
import { ActionBarOverflowMenu } from './action-bar-overflow-menu';

let page: SpecPage;
const actionsIn: Array<ActionBarItem | ListSeparator> = [
    {
        text: 'Add',
        icon: 'info',
    },
    {
        text: 'Edit',
        icon: 'idea',
    },
    {
        text: 'Delete',
        icon: 'multiply',
    },
    {
        separator: true,
    },
    {
        text: 'Settings',
        icon: 'external_link',
    },
];
describe('action-bar-overflow-menu', () => {
    beforeEach(async () => {
        page = await newSpecPage({
            components: [ActionBarOverflowMenu],
            template: () => (
                <limel-action-bar-overflow-menu items={actionsIn} />
            ),
        });

        await page.waitForChanges();
    });

    it('renders', () => {
        expect(page.root).toEqualHtml(`
            <limel-action-bar-overflow-menu open-direction="bottom-end">
                <limel-menu opendirection="bottom-end">
                    <button slot="trigger" type="button">
                        +4
                    </button>
                </limel-menu>
            </limel-action-bar-overflow-menu>
      `);
    });
});
