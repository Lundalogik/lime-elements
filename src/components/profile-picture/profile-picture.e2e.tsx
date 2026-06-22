import { render, h } from '@stencil/vitest';

describe('limel-profile-picture', () => {
    const imgSrc =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

    it('renders the avatar with no-referrer, lazy loading and the object-fit style', async () => {
        const { root, waitForChanges } = await render(
            <limel-profile-picture
                value={imgSrc}
                imageFit="contain"
            ></limel-profile-picture>
        );
        await waitForChanges();

        const imgEl = root.shadowRoot.querySelector('img');
        expect(imgEl).not.toBeNull();
        expect(imgEl?.getAttribute('referrerpolicy')).toEqual('no-referrer');
        expect(imgEl?.getAttribute('loading')).toEqual('lazy');
        expect(
            imgEl?.style.getPropertyValue('--limel-profile-picture-object-fit')
        ).toEqual('contain');
    });

    it('flags the host with has-image-error when the image fails to load', async () => {
        const { root, waitForChanges } = await render(
            <limel-profile-picture value={imgSrc}></limel-profile-picture>
        );
        await waitForChanges();

        expect(root.classList.contains('has-image-error')).toBe(false);

        root.shadowRoot.querySelector('img')?.dispatchEvent(new Event('error'));
        await waitForChanges();

        expect(root.classList.contains('has-image-error')).toBe(true);
    });
});
