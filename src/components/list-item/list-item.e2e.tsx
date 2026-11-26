import { render, h } from '@stencil/vitest';

const PIXEL =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
const BROKEN = 'data:image/png;base64,AAAA';

describe('limel-list-item', () => {
    it('renders a default list item with correct role and aria-disabled', async () => {
        const { root, waitForChanges } = await render(
            <limel-list-item text="Item"></limel-list-item>
        );
        await waitForChanges();

        expect(root.getAttribute('role')).toEqual('listitem');
        expect(root.getAttribute('aria-disabled')).toEqual('false');
        expect(root.getAttribute('text')).toEqual('Item');
        expect(root.hasAttribute('secondary-text')).toBe(false);
        expect(root.hasAttribute('aria-selected')).toBe(false);
        expect(root.hasAttribute('aria-checked')).toBe(false);
    });

    it('sets aria-describedby when secondaryText is provided', async () => {
        const { root, waitForChanges } = await render(
            <limel-list-item text="Item" secondaryText="More"></limel-list-item>
        );
        await waitForChanges();

        const describedBy = root.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
    });

    it('renders radio item with correct role and aria-checked', async () => {
        const { root, waitForChanges } = await render(
            <limel-list-item
                type="radio"
                selected={true}
                text="Radio"
            ></limel-list-item>
        );
        await waitForChanges();

        expect(root.getAttribute('role')).toEqual('radio');
        expect(root.getAttribute('aria-checked')).toEqual('true');
        const radio = root.querySelector('input[type="radio"]');
        expect(radio).not.toBeNull();
    });

    it('renders checkbox item with correct role and aria-checked', async () => {
        const { root, waitForChanges } = await render(
            <limel-list-item type="checkbox" text="Check"></limel-list-item>
        );
        await waitForChanges();

        expect(root.getAttribute('role')).toEqual('checkbox');
        expect(root.getAttribute('aria-checked')).toEqual('false');
        const checkbox = root.querySelector('input[type="checkbox"]');
        expect(checkbox).not.toBeNull();
    });

    it('renders action menu trigger without producing interact event', async () => {
        const { root, waitForChanges, spyOnEvent } = await render(
            <limel-list-item
                type="option"
                text="Actions"
                actions={[{ text: 'Action', value: 'a' }]}
            ></limel-list-item>
        );
        const interactSpy = spyOnEvent('interact');
        await waitForChanges();

        const trigger = root.querySelector('.action-menu-trigger');
        expect(trigger).not.toBeNull();
        (trigger as HTMLElement).click();
        await waitForChanges();
        expect(interactSpy).not.toHaveReceivedEvent();
    });

    it('reflects aria-selected when type=option and selected prop changes', async () => {
        const { root, waitForChanges, setProps } = await render(
            <limel-list-item type="option" text="SelState"></limel-list-item>
        );
        await waitForChanges();

        expect(root.getAttribute('aria-selected')).toEqual('false');

        await setProps({ selected: true });
        await waitForChanges();

        expect(root.getAttribute('aria-selected')).toEqual('true');
    });

    it('renders icon when provided', async () => {
        const { root, waitForChanges } = await render(
            <limel-list-item text="Media" icon="info"></limel-list-item>
        );
        await waitForChanges();

        const iconEl = root.querySelector('limel-icon');
        expect(iconEl).not.toBeNull();
    });

    it('renders image when provided', async () => {
        const imgSrc =
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        const { root, waitForChanges } = await render(
            <limel-list-item
                text="Pic"
                image={{ src: imgSrc, alt: 'a' }}
            ></limel-list-item>
        );
        await waitForChanges();

        const imgEl = root.querySelector('img');
        expect(imgEl).not.toBeNull();
        expect(imgEl?.hasAttribute('referrerpolicy')).toBe(false);
        expect(imgEl?.getAttribute('loading')).toEqual('lazy');
    });

    it('forwards referrerpolicy to the rendered image when set', async () => {
        const imgSrc =
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        const { root, waitForChanges } = await render(
            <limel-list-item
                text="Pic"
                image={{
                    src: imgSrc,
                    alt: 'a',
                    referrerpolicy: 'no-referrer',
                }}
            ></limel-list-item>
        );
        await waitForChanges();

        const imgEl = root.querySelector('img');
        expect(imgEl?.getAttribute('referrerpolicy')).toEqual('no-referrer');
    });

    it('applies the image loading strategy when set', async () => {
        const imgSrc =
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        const { root, waitForChanges } = await render(
            <limel-list-item
                text="Pic"
                image={{ src: imgSrc, alt: 'a', loading: 'eager' }}
            ></limel-list-item>
        );
        await waitForChanges();

        const imgEl = root.querySelector('img');
        expect(imgEl?.getAttribute('loading')).toEqual('eager');
    });

    describe('with initials', () => {
        it('renders the initials of the name when there is no image', async () => {
            const { root, waitForChanges } = await render(
                <limel-list-item
                    text="Elin Berg"
                    initials={{ name: 'Elin Berg' }}
                ></limel-list-item>
            );
            await waitForChanges();

            const tile = root.querySelector('limel-initials');
            await vi.waitFor(() => {
                expect(
                    tile.shadowRoot?.querySelector('.tile')?.textContent
                ).toEqual('EB');
            });
        });

        it('reads a name given with a name type by that type', async () => {
            const { root, waitForChanges } = await render(
                <limel-list-item
                    text="Northwind Bikes AB"
                    initials={{
                        name: 'Northwind Bikes AB',
                        nameType: 'company',
                    }}
                ></limel-list-item>
            );
            await waitForChanges();

            const tile = root.querySelector('limel-initials');
            expect(tile?.name).toEqual('Northwind Bikes AB');
            expect(tile?.nameType).toEqual('company');
        });

        it('shows the image instead when both are given', async () => {
            const { root, waitForChanges } = await render(
                <limel-list-item
                    text="Elin Berg"
                    initials={{ name: 'Elin Berg' }}
                    image={{ src: PIXEL, alt: '' }}
                ></limel-list-item>
            );
            await waitForChanges();

            expect(root.querySelector('img')).not.toBeNull();
            expect(root.querySelector('limel-initials')).toBeNull();
        });

        it('renders no tile for a name without letters or digits', async () => {
            const { root, waitForChanges } = await render(
                <limel-list-item
                    text="Party"
                    initials={{ name: '🎉 ...' }}
                ></limel-list-item>
            );
            await waitForChanges();

            expect(root.querySelector('limel-initials')).toBeNull();
        });

        it('renders no tile for a company name that is only a legal form', async () => {
            const { root, waitForChanges } = await render(
                <limel-list-item
                    text="AB"
                    initials={{ name: 'AB', nameType: 'company' }}
                ></limel-list-item>
            );
            await waitForChanges();

            expect(root.querySelector('limel-initials')).toBeNull();
        });

        it('puts an icon on the corner of the tile, as on an image', async () => {
            const { root, waitForChanges } = await render(
                <limel-list-item
                    text="Elin Berg"
                    icon="info"
                    initials={{ name: 'Elin Berg' }}
                ></limel-list-item>
            );
            await waitForChanges();

            const icon = root.querySelector('limel-icon');
            expect(getComputedStyle(icon).position).toEqual('absolute');
        });

        it('dims the tile of a disabled item, as an image', async () => {
            const { root, waitForChanges } = await render(
                <limel-list-item
                    text="Elin Berg"
                    initials={{ name: 'Elin Berg' }}
                    disabled={true}
                ></limel-list-item>
            );
            await waitForChanges();

            const tile = root.querySelector('limel-initials');
            expect(getComputedStyle(tile).opacity).toEqual('0.4');
        });

        it('places a checkbox after the tile, as after an image', async () => {
            const { root, waitForChanges } = await render(
                <limel-list-item
                    text="Elin Berg"
                    type="checkbox"
                    initials={{ name: 'Elin Berg' }}
                ></limel-list-item>
            );
            await waitForChanges();

            const checkbox = root.querySelector('.boolean-input');
            expect(getComputedStyle(checkbox).order).toEqual('2');
        });

        it('shows the initials when the image fails to load', async () => {
            const { root } = await render(
                <limel-list-item
                    text="Elin Berg"
                    initials={{ name: 'Elin Berg' }}
                    image={{ src: BROKEN, alt: '', loading: 'eager' }}
                ></limel-list-item>
            );

            await vi.waitFor(() => {
                expect(root.querySelector('limel-initials')).not.toBeNull();
            });
            expect(root.querySelector('img')).toBeNull();
        });

        it('keeps the broken image when there are no initials', async () => {
            const { root, waitForChanges } = await render(
                <limel-list-item
                    text="Elin Berg"
                    image={{ src: BROKEN, alt: '', loading: 'eager' }}
                ></limel-list-item>
            );

            const img = root.querySelector('img');
            await vi.waitFor(() => {
                expect(img.complete).toBe(true);
            });
            await waitForChanges();

            expect(root.querySelector('img')).toBe(img);
        });

        it('keeps the initials when the same broken image is given again', async () => {
            const { root, waitForChanges } = await render(
                <limel-list-item
                    text="Elin Berg"
                    initials={{ name: 'Elin Berg' }}
                    image={{ src: BROKEN, alt: '', loading: 'eager' }}
                ></limel-list-item>
            );
            await vi.waitFor(() => {
                expect(root.querySelector('limel-initials')).not.toBeNull();
            });

            (root as HTMLLimelListItemElement).image = {
                src: BROKEN,
                alt: '',
                loading: 'eager',
            };
            await waitForChanges();

            expect(root.querySelector('img')).toBeNull();
            expect(root.querySelector('limel-initials')).not.toBeNull();
        });

        it('does not blame a new image for the failure of the one it replaces', async () => {
            const { root, waitForChanges } = await render(
                <limel-list-item
                    text="Elin Berg"
                    initials={{ name: 'Elin Berg' }}
                    image={{ src: `${PIXEL}#first`, alt: '' }}
                ></limel-list-item>
            );
            const img = root.querySelector('img');

            (root as HTMLLimelListItemElement).image = { src: PIXEL, alt: '' };
            img.dispatchEvent(new Event('error'));
            await waitForChanges();

            expect(root.querySelector('img')?.getAttribute('src')).toEqual(
                PIXEL
            );
            expect(root.querySelector('limel-initials')).toBeNull();
        });

        it('does not try again any image that failed before', async () => {
            const { root, waitForChanges } = await render(
                <limel-list-item
                    text="Elin Berg"
                    initials={{ name: 'Elin Berg' }}
                    image={{ src: BROKEN, alt: '', loading: 'eager' }}
                ></limel-list-item>
            );
            const item = root as HTMLLimelListItemElement;
            await vi.waitFor(() => {
                expect(root.querySelector('limel-initials')).not.toBeNull();
            });

            item.image = { src: `${BROKEN}#second`, alt: '', loading: 'eager' };
            await waitForChanges();
            await vi.waitFor(() => {
                expect(root.querySelector('limel-initials')).not.toBeNull();
            });

            item.image = { src: BROKEN, alt: '', loading: 'eager' };
            await waitForChanges();

            expect(root.querySelector('img')).toBeNull();
            expect(root.querySelector('limel-initials')).not.toBeNull();
        });

        it('remembers a failed image for every list item', async () => {
            const src = `${PIXEL}#remembered`;
            const first = await render(
                <limel-list-item
                    text="Elin Berg"
                    initials={{ name: 'Elin Berg' }}
                    image={{ src: src, alt: '' }}
                ></limel-list-item>
            );
            first.root.querySelector('img').dispatchEvent(new Event('error'));
            await first.waitForChanges();

            const second = await render(
                <limel-list-item
                    text="Jonas Ek"
                    initials={{ name: 'Jonas Ek' }}
                    image={{ src: src, alt: '' }}
                ></limel-list-item>
            );
            await second.waitForChanges();

            expect(second.root.querySelector('img')).toBeNull();
            expect(second.root.querySelector('limel-initials')).not.toBeNull();
        });

        it('shows a new image again after an earlier one failed', async () => {
            const { root, waitForChanges } = await render(
                <limel-list-item
                    text="Elin Berg"
                    initials={{ name: 'Elin Berg' }}
                    image={{ src: BROKEN, alt: '', loading: 'eager' }}
                ></limel-list-item>
            );
            await vi.waitFor(() => {
                expect(root.querySelector('limel-initials')).not.toBeNull();
            });

            (root as HTMLLimelListItemElement).image = { src: PIXEL, alt: '' };
            await waitForChanges();

            expect(root.querySelector('img')).not.toBeNull();
            expect(root.querySelector('limel-initials')).toBeNull();
        });
    });
});
