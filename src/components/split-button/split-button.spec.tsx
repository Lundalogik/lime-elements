import { render, h } from '@stencil/vitest';

test('the component renders without menu items', async () => {
    const { root, waitForChanges } = await render(
        <limel-split-button items={[]}></limel-split-button>
    );
    await waitForChanges();

    expect(root.tagName.toLowerCase()).toBe('limel-split-button');
    expect(root.classList.contains('has-menu')).toBe(false);

    const shadowRoot = root.shadowRoot;
    expect(shadowRoot).toBeTruthy();
    expect(shadowRoot.querySelector('limel-button')).toBeTruthy();
    expect(shadowRoot.querySelector('limel-menu')).toBeFalsy();
});

test('the component renders with menu items', async () => {
    const items = [
        { text: 'Later today', secondaryText: 'at 16:45' },
        { separator: true },
    ];

    const { root, waitForChanges } = await render(
        <limel-split-button items={items}></limel-split-button>
    );
    await waitForChanges();

    expect(root.tagName.toLowerCase()).toBe('limel-split-button');
    expect(root.classList.contains('has-menu')).toBe(true);

    const shadowRoot = root.shadowRoot;
    expect(shadowRoot).toBeTruthy();
    expect(shadowRoot.querySelector('limel-button')).toBeTruthy();

    const menu = shadowRoot.querySelector('limel-menu');
    expect(menu).toBeTruthy();
    expect((menu as any).openDirection).toBe('bottom');

    const menuTrigger = shadowRoot.querySelector('button.menu-trigger');
    expect(menuTrigger).toBeTruthy();
    expect(menuTrigger.getAttribute('slot')).toBe('trigger');
});
