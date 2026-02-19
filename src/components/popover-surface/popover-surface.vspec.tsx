import { render, h } from '@stencil/vitest';

afterEach(() => {
    document.body.innerHTML = '';
});

test('render component without children', async () => {
    const { root } = await createComponent([]);
    expect(root).toMatchSnapshot();
});

test('render component with one child', async () => {
    const child1 = document.createElement('div');
    child1.textContent = 'Child 1';

    const { root } = await createComponent([child1]);
    expect(root).toMatchSnapshot();
});

test('render component with two children', async () => {
    const child1 = document.createElement('div');
    const child2 = document.createElement('div');
    child1.textContent = 'Child 1';
    child2.textContent = 'Child 2';

    const { root } = await createComponent([child1, child2]);
    expect(root).toMatchSnapshot();
});

test('render component with trigger element', async () => {
    const child1 = document.createElement('div');
    child1.textContent = 'Child 1';
    child1.slot = 'trigger';

    const { root } = await createComponent([child1]);
    expect(root).toMatchSnapshot();
});

async function createComponent(children: HTMLElement[]) {
    const aside = document.createElement('aside');
    document.body.append(aside);
    for (const child of children) {
        aside.append(child);
    }

    const result = await render(
        <limel-popover-surface
            contentCollection={aside.children}
        ></limel-popover-surface>
    );
    await result.waitForChanges();
    aside.remove();

    return result;
}
