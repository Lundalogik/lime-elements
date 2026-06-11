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

    function getAdapter(root: HTMLElement): Element | null {
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
        const adapter = getAdapter(root);
        expect(adapter).not.toBeNull();
        expect((adapter as any).contentType).toBe('markdown');
    });

    test('language attribute is set to en', async () => {
        const { root } = await createComponent();
        const adapter = getAdapter(root);
        expect(adapter).not.toBeNull();
        expect(adapter.getAttribute('language')).toBe('en');
    });

    test('html content type is passed to adapter', async () => {
        const { root } = await createComponent({
            contentType: 'html',
            value: '<p>test</p>',
        });
        const adapter = getAdapter(root);
        expect(adapter).not.toBeNull();
        expect((adapter as any).contentType).toBe('html');
        expect((adapter as any).value).toBe('<p>test</p>');
    });

    test('placeholder is rendered as aria-placeholder on adapter', async () => {
        const { root } = await createComponent({
            value: 'test',
            placeholder: 'test placeholder',
        });
        const adapter = getAdapter(root);
        expect(adapter).not.toBeNull();
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
        expect(adapter).not.toBeNull();
        expect(adapter.hasAttribute('aria-disabled')).toBe(true);
    });

    test('not disabled does not set aria-disabled on adapter', async () => {
        const { root } = await createComponent({
            value: 'test',
            disabled: false,
        });
        const adapter = getAdapter(root);
        expect(adapter).not.toBeNull();
        expect(adapter.hasAttribute('aria-disabled')).toBe(false);
    });

    test('emits a change event when a programmatically seeded value is cleared by the user', async () => {
        // Regression: seeding `value` AFTER the editor has initialised (e.g.
        // "AI Assist" placing a prompt into an already-open chat) goes through
        // the `watchValue`/`updateView` path. That path must keep the
        // change-dedup baseline in sync, otherwise clearing the seeded text
        // back to the (stale) empty baseline is wrongly suppressed and the
        // consumer never learns the field is empty.
        const changes: string[] = [];
        const { root, waitForChanges } = await createComponent();
        root.addEventListener('change', (event: Event) => {
            changes.push((event as CustomEvent<string>).detail);
        });

        // Seed a value programmatically, post-init.
        (root as any).value = 'hello';
        await waitForChanges();
        await new Promise((resolve) => setTimeout(resolve, 50));

        // The user clears the editor.
        const adapter = getAdapter(root);
        const editable = adapter.shadowRoot.querySelector(
            '.ProseMirror'
        ) as HTMLElement;
        editable.focus();
        const doc = editable.ownerDocument;
        doc.execCommand('selectAll');
        doc.execCommand('delete');

        // `change` is debounced; wait it out so the emission lands.
        await new Promise((resolve) => setTimeout(resolve, 350));
        await waitForChanges();

        expect(changes).toContain('');
    });

    test('label-to-editor id linkage is correct', async () => {
        const { root } = await createComponent();

        const notchedOutline = root.shadowRoot.querySelector(
            'limel-notched-outline'
        ) as any;
        const adapter = getAdapter(root);
        expect(adapter).not.toBeNull();

        const labelId = notchedOutline.labelId;
        expect(labelId).toBeTruthy();
        expect(adapter.getAttribute('id')).toBe(labelId);
    });
});
