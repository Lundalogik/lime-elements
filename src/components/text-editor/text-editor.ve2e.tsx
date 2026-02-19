import { render, h } from '@stencil/vitest';

describe('limel-text-editor', () => {
    async function createComponent(props: any = {}) {
        const {
            allowResize,
            contentType,
            disabled,
            helperText,
            invalid,
            label,
            placeholder,
            readonly,
            required,
            value,
        } = props;

        const { root, waitForChanges } = await render(
            <limel-text-editor
                allowResize={allowResize}
                contentType={contentType}
                disabled={disabled}
                helperText={helperText}
                invalid={invalid}
                label={label}
                placeholder={placeholder}
                readonly={readonly}
                required={required}
                value={value}
            />
        );
        await waitForChanges();

        return { root: root as HTMLLimelTextEditorElement, waitForChanges };
    }

    function getAdapter(root: HTMLElement): HTMLElement {
        return root.shadowRoot.querySelector('limel-prosemirror-adapter');
    }

    test('renders with prosemirror adapter and notched outline', async () => {
        const { root } = await createComponent();

        const adapter = getAdapter(root);
        expect(adapter).toBeTruthy();

        const notchedOutline = root.shadowRoot.querySelector(
            'limel-notched-outline'
        );
        expect(notchedOutline).toBeTruthy();
    });

    test('default content type is markdown', async () => {
        const { root } = await createComponent();
        const adapter = getAdapter(root) as any;
        expect(adapter.contentType).toBe('markdown');
    });

    test('language attribute is set to en', async () => {
        const { root } = await createComponent();
        const adapter = getAdapter(root);
        expect(adapter.getAttribute('language')).toBe('en');
    });

    test('html content type is passed to adapter', async () => {
        const { root } = await createComponent({
            contentType: 'html',
            value: '<p>test</p>',
        });
        const adapter = getAdapter(root) as any;
        expect(adapter.contentType).toBe('html');
        expect(adapter.value).toBe('<p>test</p>');
    });

    test('placeholder is rendered as aria-placeholder on adapter', async () => {
        const { root } = await createComponent({
            value: 'test',
            placeholder: 'test placeholder',
        });
        const adapter = getAdapter(root);
        expect(adapter.getAttribute('aria-placeholder')).toBe(
            'test placeholder'
        );
    });

    test('disabled sets aria-disabled on adapter', async () => {
        const { root } = await createComponent({
            value: 'test',
            disabled: true,
        });
        const adapter = getAdapter(root);
        expect(adapter.hasAttribute('aria-disabled')).toBe(true);
    });

    test('not disabled does not set aria-disabled on adapter', async () => {
        const { root } = await createComponent({
            value: 'test',
            disabled: false,
        });
        const adapter = getAdapter(root);
        expect(adapter.hasAttribute('aria-disabled')).toBe(false);
    });

    test('label-to-editor id linkage is correct', async () => {
        const { root } = await createComponent();

        const notchedOutline = root.shadowRoot.querySelector(
            'limel-notched-outline'
        ) as any;
        const adapter = getAdapter(root);

        const labelId = notchedOutline.labelId;
        expect(labelId).toBeTruthy();
        expect(adapter.getAttribute('id')).toBe(labelId);
    });
});
