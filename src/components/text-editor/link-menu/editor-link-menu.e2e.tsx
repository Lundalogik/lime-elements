import { render, h } from '@stencil/vitest';

describe('limel-text-editor-link-menu', () => {
    const link = {
        text: 'Lime Technologies',
        href: 'https://www.lime-technologies.com',
    };

    async function createMenu() {
        const { root, waitForChanges } = await render(
            <limel-text-editor-link-menu link={link} isOpen={true} />
        );
        await waitForChanges();
        await new Promise((resolve) => requestAnimationFrame(resolve));

        return { root: root as HTMLElement, waitForChanges };
    }

    function getInputFields(root: HTMLElement) {
        const fields =
            root.shadowRoot.querySelectorAll<HTMLLimelInputFieldElement>(
                'limel-input-field'
            );

        return { textField: fields[0], linkField: fields[1] };
    }

    describe('when opened', () => {
        test('focuses the link field, not the text field', async () => {
            const { root } = await createMenu();
            const { textField, linkField } = getInputFields(root);

            expect(root.shadowRoot.activeElement).toBe(linkField);
            expect(root.shadowRoot.activeElement).not.toBe(textField);
        });

        test('places the caret in the input element of the link field', async () => {
            const { root } = await createMenu();
            const { linkField } = getInputFields(root);

            expect(linkField.shadowRoot.activeElement?.tagName).toBe('INPUT');
        });
    });
});
