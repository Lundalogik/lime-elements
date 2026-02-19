import { render, h } from '@stencil/vitest';

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
        setProps({ link: { href: 'http://example.com' } });
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
});
