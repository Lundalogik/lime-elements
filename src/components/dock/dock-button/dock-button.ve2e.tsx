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

    const { root, waitForChanges } = await render(
        <limel-dock-button item={item}></limel-dock-button>
    );
    await waitForChanges();

    const eventSpy = vi.fn();
    root.addEventListener('menuOpen', (e: Event) =>
        eventSpy((e as CustomEvent).detail)
    );

    const button = root.querySelector('.button') as HTMLButtonElement;
    button.click();
    await waitForChanges();
    expect(eventSpy).toHaveBeenCalledWith(item);
});
