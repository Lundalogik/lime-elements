import { h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { BreadcrumbsItem } from '@limetech/lime-elements';
import { Breadcrumbs } from './breadcrumbs';

let page: SpecPage;
let handleSelect: jest.Mock;
const buttonLikeItems: BreadcrumbsItem[] = [
    {
        text: 'step 1',
        icon: {
            name: 'fish',
            color: 'rgb(var(--color-red-default))',
        },
    },
    {
        text: 'Step 2',
        icon: {
            name: 'cat',
            color: 'rgb(var(--color-orange-default))',
        },
    },
    {
        text: 'Step 3',
        icon: {
            name: 'dog',
            color: 'rgb(var(--color-blue-default))',
        },
    },
];

const hyperlinkItems: BreadcrumbsItem[] = [
    {
        text: 'Home',
        link: {
            href: '../../../..',
            title: 'Start',
        },
    },
    {
        text: 'Products',
        link: {
            href: '../../../',
            title: 'See all of our products',
        },
    },
    {
        text: 'Phones',
        link: {
            href: '../../',
        },
    },
    {
        text: 'Accessories',
        link: {
            href: '../',
        },
    },
    {
        text: 'Earphones',
    },
];

describe('limel-breadcrumbs', () => {
    describe('when button like items are provided', () => {
        const ids = [];
        beforeEach(async () => {
            await initializeComponent(buttonLikeItems);
            getIDs(page.root.shadowRoot.children[0], ids);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });
        it('renders the breadcrumbs with texts, icons and icon colors', () => {
            expect(page.root).toEqualHtml(
                `<limel-breadcrumbs>
                    <mock:shadow-root>
                        <ol aria-label="Breadcrumb" role="navigation" style="--limel-breadcrumbs-divider: '›';">
                            <button class="step" id="${ids[0]}" role="listitem">
                                <limel-icon name="fish" style="color: rgb(var(--color-red-default));"></limel-icon>
                                <span class="text">step 1</span>
                            </button>
                            <button class="step" id="${ids[1]}" role="listitem">
                                <limel-icon name="cat" style="color: rgb(var(--color-orange-default));"></limel-icon>
                                <span class="text">Step 2</span>
                            </button>
                            <li aria-current="step" class="last step" tabindex="-1">
                                <limel-icon name="dog" style="color: rgb(var(--color-blue-default));"></limel-icon>
                                <span class="text">Step 3</span>
                            </li>
                        </ol>
                    </mock:shadow-root>
                </limel-breadcrumbs>`
            );
        });

        it('emits select event when "step 1" button is clicked', async () => {
            const button: HTMLButtonElement =
                page.root.shadowRoot.querySelectorAll('button')[0];
            button.click();

            page.waitForChanges();

            expect(handleSelect).toBeCalledTimes(1);
            expect(handleSelect.mock.calls[0][0].detail).toEqual({
                icon: {
                    name: 'fish',
                    color: 'rgb(var(--color-red-default))',
                },
                text: 'step 1',
            });
        });
    });

    describe('with custom divider', () => {
        it('renders the breadcrumbs with the chosen divider', async () => {
            await initializeComponent(buttonLikeItems, '+');

            const oList: HTMLOListElement =
                page.root.shadowRoot.querySelector('ol');
            expect(
                // eslint-disable-next-line @typescript-eslint/dot-notation
                oList.style['_styles'].get('--limel-breadcrumbs-divider')
            ).toEqual("'+'");
        });
    });

    describe('when hyperlink items are provided', () => {
        it('renders the breadcrumbs with links', async () => {
            const ids = [];
            await initializeComponent(hyperlinkItems);
            getIDs(page.root.shadowRoot.children[0], ids);

            expect(page.root).toEqualHtml(
                `<limel-breadcrumbs>
                    <mock:shadow-root>
                        <ol aria-label="Breadcrumb" role="navigation" style="--limel-breadcrumbs-divider: '›';">
                            <a class="step" href="../../../.." id=${ids[0]} role="listitem" title="Start">
                                <span class="text">Home</span>
                            </a>
                            <a class="step" href="../../../" id=${ids[1]} role="listitem" title="See all of our products">
                                <span class="text">Products</span>
                            </a>
                            <a class="step" href="../../" id=${ids[2]} role="listitem">
                                <span class="text">Phones</span>
                            </a>
                            <a class="step" href="../" id=${ids[3]} role="listitem">
                                <span class="text">Accessories</span>
                            </a>
                            <li aria-current="page" class="last step" tabindex="-1">
                                <span class="text">Earphones</span>
                            </li>
                        </ol>
                    </mock:shadow-root>
                </limel-breadcrumbs>`
            );
        });
    });
});

/**
 * Ids are randomly generated and we do not have access to them as they
 * are inside the breadcrumbs component. But we can get them this way.
 * Retrieves ids via inorder traversal
 * @param {Element} node base node
 * @param {string[]} ids id array that you wish to populate
 * @return void
 */
function getIDs(node: Element, ids: string[]) {
    if (node.children && node.id) {
        ids.push(node.id);
    }

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < node.children.length; i++) {
        getIDs(node.children[i], ids);
    }
}

async function initializeComponent(
    items: BreadcrumbsItem[],
    divider: string = '›'
) {
    handleSelect = jest.fn();
    page = await newSpecPage({
        components: [Breadcrumbs],
        template: () => (
            <limel-breadcrumbs
                items={items}
                onSelect={handleSelect}
                divider={divider}
            />
        ),
    });

    await page.waitForChanges();
}
