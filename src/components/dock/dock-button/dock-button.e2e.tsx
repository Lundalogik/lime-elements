import { render, h } from '@stencil/vitest';
import { DockItem } from '../dock.types';

test('emits an event when dock menu is opened', async () => {
    const item: DockItem = {
        id: 'tables',
        label: 'Tables',
        icon: 'insert_table',
        dockMenu: {
            componentName: 'my-custom-menu',
        },
    };

    const { root, waitForChanges, spyOnEvent } = await render(
        <limel-dock-button item={item}></limel-dock-button>
    );
    const menuOpenSpy = spyOnEvent('menuOpen');
    await waitForChanges();

    const button = root.querySelector('.button') as HTMLButtonElement;
    button.click();
    await waitForChanges();
    expect(menuOpenSpy).toHaveReceivedEventTimes(1);
    expect(menuOpenSpy).toHaveReceivedEventDetail(item);
});
