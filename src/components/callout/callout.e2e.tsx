import { render, h } from '@stencil/vitest';

describe('limel-callout', () => {
    it('renders a callout with the default "Note" type', async () => {
        const { root, waitForChanges } = await render(
            <limel-callout></limel-callout>
        );
        await waitForChanges();

        const shadow = root.shadowRoot;
        const heading = shadow.querySelector('.heading');
        const icon = shadow.querySelector('limel-icon');
        expect(heading.textContent).toEqual('Note');
        expect(icon.getAttribute('name')).toEqual('info');
    });

    it('renders a callout with the provided heading', async () => {
        const { root, waitForChanges } = await render(
            <limel-callout heading="Important"></limel-callout>
        );
        await waitForChanges();

        const heading = root.shadowRoot.querySelector('.heading');
        expect(heading.textContent).toEqual('Important');
    });

    it('renders a callout with the provided icon', async () => {
        const { root, waitForChanges } = await render(
            <limel-callout icon="unit-test"></limel-callout>
        );
        await waitForChanges();

        const icon = root.shadowRoot.querySelector('limel-icon');
        expect(icon.getAttribute('name')).toEqual('unit-test');
    });

    it('renders a callout with the correct icon based on type', async () => {
        const { root, waitForChanges } = await render(
            <limel-callout type="tip"></limel-callout>
        );
        await waitForChanges();

        const icon = root.shadowRoot.querySelector('limel-icon');
        expect(icon.getAttribute('name')).toEqual('idea');
    });

    it('renders a callout with the default icon if type is not recognized', async () => {
        const { root, waitForChanges } = await render(
            <limel-callout type="non-existing-type"></limel-callout>
        );
        await waitForChanges();

        const icon = root.shadowRoot.querySelector('limel-icon');
        expect(icon.getAttribute('name')).toEqual('info');
    });
});
