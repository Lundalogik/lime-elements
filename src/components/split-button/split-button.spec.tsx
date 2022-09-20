import { h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { SplitButton } from './split-button';

let page: SpecPage;
let splitButton: HTMLLimelSplitButtonElement;

describe('limel-split-button', () => {
    beforeEach(async () => {
        page = await newSpecPage({
            components: [SplitButton],
            template: () => <limel-split-button />,
        });

        splitButton = page.body.querySelector('limel-split-button');
    });

    it('the component renders', () => {
        expect(splitButton).toEqualHtml(`
            <limel-split-button>
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
});
