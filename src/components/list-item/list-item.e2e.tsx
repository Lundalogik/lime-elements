import { render, h } from '@stencil/vitest';

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

        setProps({ selected: true });
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
    });
});
