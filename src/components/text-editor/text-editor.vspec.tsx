import { render, h } from '@stencil/vitest';

describe('limel-text-editor', () => {
    async function createComponent(props: Record<string, unknown> = {}) {
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

    test('the component renders', async () => {
        const { root } = await createComponent();

        expect(root).not.toBeFalsy();

        const notchedOutline = root.shadowRoot.querySelector(
            'limel-notched-outline'
        );
        expect(notchedOutline).not.toBeFalsy();

        const prosemirrorAdapter = root.shadowRoot.querySelector(
            'limel-prosemirror-adapter'
        );
        expect(prosemirrorAdapter).not.toBeFalsy();
        expect((prosemirrorAdapter as any).contentType).toBe('markdown');
        expect((prosemirrorAdapter as any).language).toBe('en');
    });

    test.each([
        [
            { contentType: 'html', value: '<p>test</p>' },
            { contentType: 'html', value: '<p>test</p>' },
        ],
        [
            { contentType: 'markdown', value: 'test' },
            { contentType: 'markdown', value: 'test' },
        ],
    ])(
        'content type and value get passed to the adapter',
        async (props, expected) => {
            const { root } = await createComponent(props);

            const adapter = root.shadowRoot.querySelector(
                'limel-prosemirror-adapter'
            ) as any;
            expect(adapter.contentType).toBe(expected.contentType);
            expect(adapter.value).toBe(expected.value);
        }
    );

    describe('placeholder', () => {
        test('the placeholder is rendered', async () => {
            const { root } = await createComponent({
                placeholder: 'my placeholder',
            });
            const placeholder = root.shadowRoot.querySelector('.placeholder');
            expect(placeholder).not.toBeFalsy();
        });
    });

    describe('helpertext', () => {
        test('the helper line is rendered', async () => {
            const { root } = await createComponent({
                helperText: 'my helpertext',
            });

            const helperline =
                root.shadowRoot.querySelector('limel-helper-line');

            expect(helperline).not.toBeFalsy();
            expect((helperline as any).helperText).toEqual('my helpertext');
        });

        test('if invalid and not readonly, the helper line is also invalid', async () => {
            const { root } = await createComponent({
                helperText: 'my helpertext',
                readonly: false,
                invalid: true,
            });
            const helperline =
                root.shadowRoot.querySelector('limel-helper-line');

            expect((helperline as any).invalid).toBe(true);
        });
    });

    describe('label', () => {
        test('it renders the label', async () => {
            const { root } = await createComponent({ label: 'my label' });

            const notchedOutline = root.shadowRoot.querySelector(
                'limel-notched-outline'
            );
            expect(notchedOutline).not.toBeFalsy();
            expect((notchedOutline as any).label).toEqual('my label');
        });
    });
});
