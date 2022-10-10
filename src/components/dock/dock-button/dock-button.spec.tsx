import { h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { DockItem } from '../dock.types';
import { DockButton } from './dock-button';

let page: SpecPage;
let item: DockItem;

class IntersectionObserverMock {
    observe() {}
    disconnect() {}
    unobserve() {}
}

global.IntersectionObserver = IntersectionObserverMock as any;

beforeEach(async () => {
    item = {
        id: 'tables',
        label: 'Tables',
        icon: 'insert_table',
        dockMenu: {
            componentName: 'my-custom-menu',
        },
    };
    page = await newSpecPage({
        components: [DockButton],
        template: () => <limel-dock-button item={item} />,
    });
    await page.waitForChanges();
});

test('emits an event when dock menu is opened', async () => {
    const eventSpy = jest.fn();
    page.body.addEventListener('menuOpen', eventSpy);

    const button = page.root.querySelector('.button') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalled();
    expect(eventSpy.mock.calls[0][0].detail).toEqual(item);
});
