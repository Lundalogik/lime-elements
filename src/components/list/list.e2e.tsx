import { render, h } from '@stencil/vitest';
import { IconSize } from '../icon/icon.types';

describe('limel-list', () => {
    describe('without items', () => {
        it('renders an empty listbox', async () => {
            const { root, waitForChanges } = await render(
                <limel-list></limel-list>
            );
            await waitForChanges();

            const innerList = root.shadowRoot.querySelector('ul');
            expect(innerList).not.toBeNull();
            expect(innerList.classList.contains('mdc-deprecated-list')).toBe(
                true
            );
            expect(innerList.getAttribute('role')).toEqual('listbox');

            const items = root.shadowRoot.querySelectorAll('limel-list-item');
            expect(items.length).toBe(0);
        });
    });

    describe('with an item', () => {
        it('renders the item', async () => {
            const { root, waitForChanges } = await render(
                <limel-list items={[{ text: 'item 1' }]}></limel-list>
            );
            await waitForChanges();

            const itemEl = root.shadowRoot.querySelector('limel-list-item');
            expect(itemEl).not.toBeNull();
            expect(itemEl.classList.contains('mdc-deprecated-list-item')).toBe(
                true
            );
            expect(itemEl.getAttribute('tabindex')).toEqual('0');
            expect(itemEl.getAttribute('aria-disabled')).toEqual('false');
            expect(itemEl.getAttribute('text')).toEqual('item 1');
        });
    });

    describe('with a mix of items with images and icon-only items', () => {
        const items = [
            {
                text: 'with image',
                icon: 'coffee',
                image: {
                    src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJyZWQiLz48L3N2Zz4=',
                    alt: 'a red square',
                },
            },
            { text: 'icon only', icon: 'coffee' },
        ];

        const iconSizes: IconSize[] = ['x-small', 'small', 'medium', 'large'];
        const variants = iconSizes.flatMap((iconSize) => [
            { iconSize, badgeIcons: false },
            { iconSize, badgeIcons: true },
        ]);

        const renderList = async (variant: (typeof variants)[number]) => {
            const { root, waitForChanges } = await render(
                <limel-list
                    items={items}
                    iconSize={variant.iconSize}
                    badgeIcons={variant.badgeIcons}
                />
            );
            await waitForChanges();

            const [withImage, iconOnly] = [
                ...root.shadowRoot.querySelectorAll('limel-list-item'),
            ];

            return { withImage, iconOnly };
        };

        it.each(variants)(
            'lines up the labels when iconSize is $iconSize and badgeIcons is $badgeIcons',
            async (variant) => {
                const { withImage, iconOnly } = await renderList(variant);
                const labelLeft = (item: Element) =>
                    item.querySelector('.label').getBoundingClientRect().left;

                expect(labelLeft(iconOnly)).toEqual(labelLeft(withImage));
            }
        );

        it.each(variants)(
            'gives the lone icon the image footprint when iconSize is $iconSize and badgeIcons is $badgeIcons',
            async (variant) => {
                const { withImage, iconOnly } = await renderList(variant);
                const imageBox = withImage
                    .querySelector('img')
                    .getBoundingClientRect();
                const iconBox = iconOnly
                    .querySelector('limel-icon')
                    .getBoundingClientRect();

                expect(iconBox.width).toEqual(imageBox.width);
                expect(iconBox.height).toEqual(imageBox.height);
                expect(iconBox.left).toEqual(imageBox.left);
            }
        );
    });

    describe('with a disabled item', () => {
        it('renders the item as disabled', async () => {
            const { root, waitForChanges } = await render(
                <limel-list
                    items={[{ text: 'item 1', disabled: true }]}
                ></limel-list>
            );
            await waitForChanges();

            const items = root.shadowRoot.querySelectorAll('limel-list-item');
            expect(items.length).toBe(1);
            expect(
                items[0].classList.contains('mdc-deprecated-list-item')
            ).toBe(true);
            // Disabled items should not have tabindex, but the timing
            // of when the list removes tabindex may vary
            expect(items[0].getAttribute('aria-disabled')).toEqual('true');
            expect(items[0].getAttribute('text')).toEqual('item 1');
        });
    });

    describe('with multiple items', () => {
        const items = [
            { text: 'item 1' },
            { separator: true },
            { text: 'item 3' },
            { text: 'item 4', disabled: true },
            { text: 'item 5' },
        ];

        it('renders the items and separators', async () => {
            const { root, waitForChanges } = await render(
                <limel-list items={items}></limel-list>
            );
            await waitForChanges();

            const itemEls = root.shadowRoot.querySelectorAll('limel-list-item');
            const separatorEls =
                root.shadowRoot.querySelectorAll('[role="separator"]');
            expect(itemEls.length).toBe(4);
            expect(separatorEls.length).toBe(1);
        });

        it('can render separators', async () => {
            const { root, waitForChanges } = await render(
                <limel-list items={items}></limel-list>
            );
            await waitForChanges();

            const separatorEl =
                root.shadowRoot.querySelector('[role="separator"]');
            expect(separatorEl).not.toBeNull();
            expect(
                separatorEl.classList.contains('mdc-deprecated-list-divider')
            ).toBe(true);
            expect(
                separatorEl.classList.contains('mdc-deprecated-list-item')
            ).toBe(false);
            expect(separatorEl.getAttribute('role')).toEqual('separator');
        });

        it('gives each item the correct index', async () => {
            const { root, waitForChanges } = await render(
                <limel-list items={items}></limel-list>
            );
            await waitForChanges();

            const itemEls = root.shadowRoot.querySelectorAll('limel-list-item');
            expect(itemEls[0].dataset.index).toEqual('0');
            expect(itemEls[1].dataset.index).toEqual('2');
            expect(itemEls[2].dataset.index).toEqual('3');
            expect(itemEls[3].dataset.index).toEqual('4');
        });
    });

    describe('with at least one item with secondary text', () => {
        const items = [
            { text: 'item 1' },
            { separator: true },
            { text: 'item 3', secondaryText: 'some info' },
            { text: 'item 4', disabled: true },
            { text: 'item 5' },
        ];

        it('renders items WITHOUT secondary text as single line', async () => {
            const { root, waitForChanges } = await render(
                <limel-list items={items}></limel-list>
            );
            await waitForChanges();

            const itemEls = root.shadowRoot.querySelectorAll('limel-list-item');
            expect(itemEls[0].getAttribute('text')).toEqual('item 1');
            expect(itemEls[0].hasAttribute('secondary-text')).toBe(false);
        });

        it('renders items WITH secondary text via reflected attributes', async () => {
            const { root, waitForChanges } = await render(
                <limel-list items={items}></limel-list>
            );
            await waitForChanges();

            const itemEls = root.shadowRoot.querySelectorAll('limel-list-item');
            expect(itemEls[1].getAttribute('text')).toEqual('item 3');
            expect(itemEls[1].getAttribute('secondary-text')).toEqual(
                'some info'
            );
        });
    });

    describe('when the attribute `type`', () => {
        describe('is not set', () => {
            it('is not selectable', async () => {
                const { root, waitForChanges } = await render(
                    <limel-list></limel-list>
                );
                await waitForChanges();

                const innerList = root.shadowRoot.querySelector('ul');
                expect(innerList).not.toBeNull();
                expect(innerList.classList.contains('selectable')).toBe(false);
            });
        });

        describe('is set as `selectable`', () => {
            it('renders selectable items with role option', async () => {
                const { root, waitForChanges } = await render(
                    <limel-list
                        type="selectable"
                        items={[{ text: 'item 1' }]}
                    ></limel-list>
                );
                await waitForChanges();

                const itemEl = root.shadowRoot.querySelector('limel-list-item');
                expect(itemEl).not.toBeNull();
                expect(itemEl.getAttribute('type')).toEqual('option');
                expect(itemEl.getAttribute('role')).toEqual('option');
            });

            it('has the value `selectable`', async () => {
                const { root, waitForChanges } = await render(
                    <limel-list
                        type="selectable"
                        items={[{ text: 'item 1' }]}
                    ></limel-list>
                );
                await waitForChanges();
                expect((root as any).type).toBe('selectable');
            });

            it('emits change event when an item is selected', async () => {
                const items = [{ text: 'item 1' }];
                const { root, waitForChanges, spyOnEvent } = await render(
                    <limel-list type="selectable" items={items}></limel-list>
                );
                const changeSpy = spyOnEvent('change');
                await waitForChanges();

                const item = root.shadowRoot.querySelector('limel-list-item');
                expect(item).not.toBeNull();
                (item as HTMLElement).click();
                await waitForChanges();

                expect(changeSpy).toHaveReceivedEventTimes(1);
                expect(changeSpy).toHaveReceivedEventDetail({
                    ...items[0],
                    selected: true,
                });
            });

            it('focuses the pressed item, not the first one', async () => {
                const items = [
                    { text: 'item 1' },
                    { text: 'item 2' },
                    { text: 'item 3' },
                ];
                const { root, waitForChanges } = await render(
                    <limel-list type="selectable" items={items}></limel-list>
                );
                await waitForChanges();

                const itemEls =
                    root.shadowRoot.querySelectorAll('limel-list-item');
                const pressed = itemEls[2] as HTMLElement;
                pressed.dispatchEvent(
                    new MouseEvent('mousedown', {
                        bubbles: true,
                        composed: true,
                        cancelable: true,
                    })
                );
                await waitForChanges();

                expect(root.shadowRoot.activeElement).toBe(pressed);
            });
        });

        describe('is set as `radio`', () => {
            it('emits change when a radio item is pressed', async () => {
                const items = [{ text: 'item 1' }, { text: 'item 2' }];
                const { root, waitForChanges, spyOnEvent } = await render(
                    <limel-list type="radio" items={items}></limel-list>
                );
                const changeSpy = spyOnEvent('change');
                await waitForChanges();

                const itemEls =
                    root.shadowRoot.querySelectorAll('limel-list-item');
                const target = itemEls[1] as HTMLElement;
                target.dispatchEvent(
                    new MouseEvent('mousedown', {
                        bubbles: true,
                        composed: true,
                        cancelable: true,
                    })
                );
                target.click();
                await waitForChanges();

                expect(changeSpy).toHaveReceivedEventDetail({
                    ...items[1],
                    selected: true,
                });
            });
        });

        describe('is set as `checkbox`', () => {
            it('emits change when a checkbox item is pressed', async () => {
                const items = [{ text: 'item 1' }, { text: 'item 2' }];
                const { root, waitForChanges, spyOnEvent } = await render(
                    <limel-list type="checkbox" items={items}></limel-list>
                );
                const changeSpy = spyOnEvent('change');
                await waitForChanges();

                const itemEls =
                    root.shadowRoot.querySelectorAll('limel-list-item');
                const target = itemEls[1] as HTMLElement;
                target.dispatchEvent(
                    new MouseEvent('mousedown', {
                        bubbles: true,
                        composed: true,
                        cancelable: true,
                    })
                );
                target.click();
                await waitForChanges();

                expect(changeSpy).toHaveReceivedEventDetail([
                    { ...items[1], selected: true },
                ]);
            });
        });
    });
});
