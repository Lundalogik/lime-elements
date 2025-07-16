import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { PopoverSurface } from './popover-surface';

let page: SpecPage;

test('render component without children', async () => {
    await createComponent([]);

    expect(page.root).toMatchSnapshot();
});

test('render component with one child', async () => {
    const child1 = document.createElement('div');
    child1.textContent = 'Child 1';

    await createComponent([child1]);

    expect(page.root).toMatchSnapshot();
});

test('render component with two children', async () => {
    const child1 = document.createElement('div');
    const child2 = document.createElement('div');
    child1.textContent = 'Child 1';
    child2.textContent = 'Child 2';

    await createComponent([child1, child2]);

    expect(page.root).toMatchSnapshot();
});

test('render component with trigger element', async () => {
    const child1 = document.createElement('div');
    child1.textContent = 'Child 1';
    child1.slot = 'trigger';

    await createComponent([child1]);

    expect(page.root).toMatchSnapshot();
});

async function createComponent(children: HTMLElement[]): Promise<void> {
    const aside = document.createElement('aside');
    document.body.append(aside);
    for (const child of children) {
        aside.append(child);
    }

    page = await newSpecPage({
        components: [PopoverSurface],
        template: () => (
            <limel-popover-surface contentCollection={aside.children} />
        ),
    });

    await page.waitForChanges();
}
