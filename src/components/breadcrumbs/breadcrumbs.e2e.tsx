import { render, h } from '@stencil/vitest';
import { BreadcrumbsItem } from './breadcrumbs.types';

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
        let root: HTMLElement;
        let waitForChanges: () => Promise<void>;
        let selectSpy: any;

        beforeEach(async () => {
            const result = await render(
                <limel-breadcrumbs items={buttonLikeItems} />
            );
            root = result.root;
            waitForChanges = result.waitForChanges;
            selectSpy = result.spyOnEvent('select');
            await waitForChanges();
        });

        it('renders buttons for non-last items and a list item for the last', () => {
            const shadow = root.shadowRoot;
            const buttons = shadow.querySelectorAll('button.step');
            expect(buttons.length).toBe(2);

            const lastItem = shadow.querySelector('li.last.step');
            expect(lastItem).toBeTruthy();

            // Check text content
            expect(buttons[0].textContent).toContain('step 1');
            expect(buttons[1].textContent).toContain('Step 2');
            expect(lastItem.textContent).toContain('Step 3');
        });

        it('renders icons with correct names', () => {
            const shadow = root.shadowRoot;
            const icons = shadow.querySelectorAll('limel-icon');
            expect(icons.length).toBe(3);
            expect(icons[0].getAttribute('name')).toBe('fish');
            expect(icons[1].getAttribute('name')).toBe('cat');
            expect(icons[2].getAttribute('name')).toBe('dog');
        });

        it('emits select event when a button is clicked', async () => {
            const button = root.shadowRoot.querySelectorAll('button.step')[0];
            (button as HTMLButtonElement).click();
            await waitForChanges();

            expect(selectSpy).toHaveReceivedEventTimes(1);
            expect(selectSpy).toHaveReceivedEventDetail({
                text: 'step 1',
                icon: {
                    name: 'fish',
                    color: 'rgb(var(--color-red-default))',
                },
            });
        });
    });

    describe('when hyperlink items are provided', () => {
        let root: HTMLElement;
        let waitForChanges: () => Promise<void>;

        beforeEach(async () => {
            const result = await render(
                <limel-breadcrumbs items={hyperlinkItems} />
            );
            root = result.root;
            waitForChanges = result.waitForChanges;
            await waitForChanges();
        });

        it('renders links for non-last items', () => {
            const shadow = root.shadowRoot;
            const links = shadow.querySelectorAll('a.step');
            expect(links.length).toBe(4);

            expect(links[0].getAttribute('href')).toBe('../../../..');
            expect(links[0].getAttribute('title')).toBe('Start');
            expect(links[0].textContent).toContain('Home');

            expect(links[1].getAttribute('href')).toBe('../../../');
            expect(links[1].getAttribute('title')).toBe(
                'See all of our products'
            );

            expect(links[2].getAttribute('href')).toBe('../../');
            expect(links[3].getAttribute('href')).toBe('../');
        });

        it('renders the last item as a non-interactive list item', () => {
            const shadow = root.shadowRoot;
            const lastItem = shadow.querySelector('li.last.step');
            expect(lastItem).toBeTruthy();
            expect(lastItem.getAttribute('aria-current')).toBe('page');
            expect(lastItem.textContent).toContain('Earphones');
        });
    });
});
