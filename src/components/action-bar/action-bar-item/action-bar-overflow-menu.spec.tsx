import { render, h } from '@stencil/vitest';
import { ActionBarItem } from '../action-bar.types';
import { ListSeparator } from '../../../global/shared-types/separator.types';

const actionsIn: Array<ActionBarItem | ListSeparator> = [
    { text: 'Add', icon: 'info' },
    { text: 'Edit', icon: 'idea' },
    { text: 'Delete', icon: 'multiply' },
    { separator: true },
    { text: 'Settings', icon: 'external_link' },
];

describe('action-bar-overflow-menu', () => {
    it('renders the overflow count and menu', async () => {
        const { root, waitForChanges } = await render(
            <limel-action-bar-overflow-menu
                items={actionsIn}
            ></limel-action-bar-overflow-menu>
        );
        await waitForChanges();

        const menu = root.querySelector('limel-menu');
        expect(menu).toBeTruthy();

        const trigger = root.querySelector('button[slot="trigger"]');
        expect(trigger).toBeTruthy();
        expect(trigger.textContent.trim()).toBe('+4');
    });
});
