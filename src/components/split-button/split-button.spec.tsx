import { h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { SplitButton } from './split-button';

let page: SpecPage;

test('the component renders without menu items', async () => {
    const splitButton = await createComponent([]);

    expect(splitButton).toEqualHtml(`
            <limel-split-button>
                <mock:shadow-root>
                    <limel-button></limel-button>
                </mock:shadow-root>
            </limel-split-button>
        `);
});

test('the component renders with menu items', async () => {
    const items = [
        { text: 'Later today', secondaryText: 'at 16:45' },
        { separator: true },
    ];

    const splitButton = await createComponent(items);

    expect(splitButton).toEqualHtml(`
            <limel-split-button class="has-menu">
                <mock:shadow-root>
                    <limel-button></limel-button>
                    <limel-menu opendirection="bottom">
                        <button class="menu-trigger" slot="trigger">
                            ⋮
                        </button>
                    </limel-menu>
                </mock:shadow-root>
            </limel-split-button>
        `);
});

async function createComponent(items: any) {
    page = await newSpecPage({
        components: [SplitButton],
        template: () => <limel-split-button items={items} />,
    });

    return page.body.querySelector('limel-split-button');
}
