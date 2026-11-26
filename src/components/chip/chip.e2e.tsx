import { render, h } from '@stencil/vitest';

const PIXEL =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
const BROKEN = 'data:image/png;base64,AAAA';

describe('limel-chip', () => {
    it('renders with the correct text', async () => {
        const { root, waitForChanges } = await render(
            <limel-chip text="Test chip"></limel-chip>
        );
        await waitForChanges();

        const chip = root.shadowRoot.querySelector('.chip');
        expect(chip.textContent).toEqual('Test chip');
    });

    it('renders as a link when the link prop is provided', async () => {
        const { root, waitForChanges, setProps } = await render(
            <limel-chip></limel-chip>
        );
        await setProps({ link: { href: 'http://example.com' } });
        await waitForChanges();

        const linkElement = root.shadowRoot.querySelector('a');
        expect(linkElement).toBeTruthy();

        const id = linkElement.getAttribute('id');
        expect(id).toMatch(/^chip-/);
    });

    it('renders with a badge when the badge prop is provided', async () => {
        const { root, waitForChanges } = await render(
            <limel-chip text="Test chip" badge="5"></limel-chip>
        );
        await waitForChanges();

        const badge = root.shadowRoot.querySelector('limel-badge');
        expect(badge.getAttribute('label')).toEqual('5');
    });

    it('renders with a remove button when the removable prop is true', async () => {
        const { root, waitForChanges } = await render(
            <limel-chip text="Test chip" removable></limel-chip>
        );
        await waitForChanges();

        const removeButton = root.shadowRoot.querySelector('.remove-button');
        expect(removeButton).not.toBeNull();
    });

    describe('with initials', () => {
        it('renders the initials of the name when there is no image', async () => {
            const { root } = await render(
                <limel-chip
                    text="Elin Berg"
                    initials={{ name: 'Elin Berg', nameType: 'default' }}
                ></limel-chip>
            );

            const tile = root.shadowRoot.querySelector('limel-initials');
            expect(tile.name).toEqual('Elin Berg');
            expect(tile.nameType).toEqual('default');
        });

        it('renders the image instead of the initials', async () => {
            const { root } = await render(
                <limel-chip
                    text="Elin Berg"
                    initials={{ name: 'Elin Berg' }}
                    image={{ src: PIXEL, alt: '' }}
                ></limel-chip>
            );

            expect(root.shadowRoot.querySelector('img')).not.toBeNull();
            expect(root.shadowRoot.querySelector('limel-initials')).toBeNull();
        });

        it('renders the initials instead of the icon', async () => {
            const { root } = await render(
                <limel-chip
                    text="Elin Berg"
                    icon="user"
                    initials={{ name: 'Elin Berg' }}
                ></limel-chip>
            );

            expect(
                root.shadowRoot.querySelector('limel-initials')
            ).not.toBeNull();
            expect(root.shadowRoot.querySelector('limel-icon')).toBeNull();
        });

        it('renders the icon when the name gives no letters', async () => {
            const { root } = await render(
                <limel-chip
                    text="AB"
                    icon="organization"
                    initials={{ name: 'AB', nameType: 'company' }}
                ></limel-chip>
            );

            expect(root.shadowRoot.querySelector('limel-icon')).not.toBeNull();
            expect(root.shadowRoot.querySelector('limel-initials')).toBeNull();
        });

        it('renders nothing ahead of the text for an empty image and no icon', async () => {
            const { root } = await render(
                <limel-chip text="Elin Berg" image={{} as any}></limel-chip>
            );

            expect(root.shadowRoot.querySelector('img')).toBeNull();
            expect(root.shadowRoot.querySelector('limel-icon')).toBeNull();
            expect(root.shadowRoot.querySelector('limel-initials')).toBeNull();
        });

        it('draws the tile in the same size as a picture, next to the text', async () => {
            const { root } = await render(
                <div>
                    <limel-chip
                        text="Elin Berg"
                        image={{ src: PIXEL, alt: '' }}
                    />
                    <limel-chip
                        text="Elin Berg"
                        initials={{ name: 'Elin Berg' }}
                    />
                </div>
            );
            const [withImage, withInitials] = [
                ...root.querySelectorAll('limel-chip'),
            ];

            const img = withImage.shadowRoot.querySelector('img');
            const tile = withInitials.shadowRoot
                .querySelector('limel-initials')
                .shadowRoot.querySelector('.tile');
            const text = withInitials.shadowRoot.querySelector('.text');

            expect(tile.getBoundingClientRect().width).toEqual(
                img.getBoundingClientRect().width
            );
            expect(getComputedStyle(text).paddingLeft).toEqual('0px');
        });

        it('shows the initials when the image fails to load', async () => {
            const { root } = await render(
                <limel-chip
                    text="Elin Berg"
                    initials={{ name: 'Elin Berg' }}
                    image={{ src: BROKEN, alt: '', loading: 'eager' }}
                ></limel-chip>
            );

            await vi.waitFor(() => {
                expect(
                    root.shadowRoot.querySelector('limel-initials')
                ).not.toBeNull();
            });
            expect(root.shadowRoot.querySelector('img')).toBeNull();
        });

        it('keeps the broken image when there are no initials', async () => {
            const { root, waitForChanges } = await render(
                <limel-chip
                    text="Elin Berg"
                    image={{ src: BROKEN, alt: '', loading: 'eager' }}
                ></limel-chip>
            );

            const img = root.shadowRoot.querySelector('img');
            await vi.waitFor(() => {
                expect(img.complete).toBe(true);
            });
            await waitForChanges();

            expect(root.shadowRoot.querySelector('img')).toBe(img);
        });

        it('shows the initials straight away for an image that failed in a list item', async () => {
            const src = `${PIXEL}#failed-in-a-list`;
            const listItem = await render(
                <limel-list-item
                    text="Elin Berg"
                    initials={{ name: 'Elin Berg' }}
                    image={{ src: src, alt: '' }}
                ></limel-list-item>
            );
            listItem.root
                .querySelector('img')
                .dispatchEvent(new Event('error'));
            await listItem.waitForChanges();

            const { root } = await render(
                <limel-chip
                    text="Elin Berg"
                    initials={{ name: 'Elin Berg' }}
                    image={{ src: src, alt: '' }}
                ></limel-chip>
            );

            expect(root.shadowRoot.querySelector('img')).toBeNull();
            expect(
                root.shadowRoot.querySelector('limel-initials')
            ).not.toBeNull();
        });
    });
});
