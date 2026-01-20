import { h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { SplitButton } from './split-button';

let page: SpecPage;

test('the component renders without menu items', async () => {
    const splitButton = await createComponent([]);

    expect(splitButton.tagName.toLowerCase()).toBe('limel-split-button');
    expect(splitButton.classList.contains('has-menu')).toBe(false);

    const shadowRoot = splitButton.shadowRoot;
    expect(shadowRoot).toBeTruthy();
    expect(shadowRoot.querySelector('limel-button')).toBeTruthy();
    expect(shadowRoot.querySelector('limel-menu')).toBeFalsy(); // No menu when no items
});

test('the component renders with menu items', async () => {
    const items = [
        { text: 'Later today', secondaryText: 'at 16:45' },
        { separator: true },
    ];

    const splitButton = await createComponent(items);

    expect(splitButton.tagName.toLowerCase()).toBe('limel-split-button');
    expect(splitButton.classList.contains('has-menu')).toBe(true);

    const shadowRoot = splitButton.shadowRoot;
    expect(shadowRoot).toBeTruthy();
    expect(shadowRoot.querySelector('limel-button')).toBeTruthy();

    const menu = shadowRoot.querySelector('limel-menu');
    expect(menu).toBeTruthy();
    expect(menu.getAttribute('opendirection')).toBe('bottom');

    const menuTrigger = shadowRoot.querySelector('button.menu-trigger');
    expect(menuTrigger).toBeTruthy();
    expect(menuTrigger.getAttribute('slot')).toBe('trigger');
});

async function createComponent(items: any) {
    page = await newSpecPage({
        components: [SplitButton],
        template: () => <limel-split-button items={items} />,
    });

    return page.body.querySelector('limel-split-button');
}
