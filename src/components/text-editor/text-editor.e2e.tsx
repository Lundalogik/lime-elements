import { render, h } from '@stencil/vitest';
import { vi } from 'vitest';

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

    describe('change event handling', () => {
        // Comfortably longer than the editor's 300 ms change debounce.
        const DEBOUNCE_WAIT = 500;

        const sleep = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        async function createEditor(props: any = {}) {
            const { root, waitForChanges, setProps } = await render(
                <limel-text-editor value={props.value} />
            );
            await waitForChanges();

            const editor = await vi.waitFor(() => {
                const contentEditable = getAdapter(
                    root
                )?.shadowRoot?.querySelector('.ProseMirror') as HTMLElement;
                expect(contentEditable).toBeTruthy();

                return contentEditable;
            });

            const changes: string[] = [];
            root.addEventListener('change', (event: CustomEvent<string>) => {
                changes.push(event.detail);
            });

            const typeText = (text: string) => {
                editor.focus();
                document.execCommand('insertText', false, text);
            };

            return {
                root: root as HTMLLimelTextEditorElement,
                waitForChanges,
                setProps,
                editor,
                typeText,
                changes,
            };
        }

        test('typing emits a single change event after the debounce delay', async () => {
            const { typeText, changes } = await createEditor();

            typeText('hello');
            expect(changes).toHaveLength(0);

            await sleep(DEBOUNCE_WAIT);
            expect(changes).toHaveLength(1);
            expect(changes[0].trim()).toBe('hello');
        });

        test('flushPendingChanges emits a pending change immediately, without a duplicate later', async () => {
            const { root, typeText, changes } = await createEditor();

            typeText('hello');
            expect(changes).toHaveLength(0);

            await root.flushPendingChanges();
            expect(changes).toHaveLength(1);
            expect(changes[0].trim()).toBe('hello');

            await sleep(DEBOUNCE_WAIT);
            expect(changes).toHaveLength(1);
        });

        test('flushPendingChanges emits nothing when no change is pending', async () => {
            const { root, changes } = await createEditor({ value: 'hello' });

            await root.flushPendingChanges();
            await sleep(DEBOUNCE_WAIT);
            expect(changes).toHaveLength(0);
        });

        test('an echoed value during a pending change is ignored', async () => {
            const { root, setProps, editor, typeText, changes } =
                await createEditor();

            typeText('first');
            await root.flushPendingChanges();
            expect(changes).toHaveLength(1);

            typeText(' second');
            // Echo the previously emitted value back, like a controlled
            // parent component catching up late.
            await setProps({ value: changes[0] });

            await root.flushPendingChanges();
            expect(changes).toHaveLength(2);
            expect(changes[1].trim()).toBe('first second');
            expect(editor.textContent).toBe('first second');
        });

        test('a differing value during a pending change replaces the content and discards the pending change', async () => {
            const { root, setProps, editor, typeText, changes } =
                await createEditor();

            typeText('first');
            await root.flushPendingChanges();
            expect(changes).toHaveLength(1);

            typeText(' second');
            // Intentionally clear the editor while the change is pending,
            // like a chat composer being reset after sending.
            await setProps({ value: '' });

            await vi.waitFor(() => {
                expect(editor.textContent).toBe('');
            });

            await sleep(DEBOUNCE_WAIT);
            expect(changes).toHaveLength(1);

            // Recreating the discarded content must emit a change; the
            // baseline is the externally set value, not the content from
            // before the external update.
            typeText('first second');
            await root.flushPendingChanges();
            expect(changes).toHaveLength(2);
            expect(changes[1].trim()).toBe('first second');
        });

        test('clear empties content when re-assigning value="" cannot', async () => {
            const { root, waitForChanges, setProps, editor, typeText } =
                await createEditor({ value: '' });

            typeText('hello');
            await vi.waitFor(() => {
                expect(editor.textContent).toBe('hello');
            });

            // '' -> '' is skipped by change detection, so the value watch
            // never fires and the prop path cannot clear. Closing that gap
            // is the whole reason clear() exists.
            await setProps({ value: '' });
            await waitForChanges();
            expect(editor.textContent).toBe('hello');

            await root.clear();
            await vi.waitFor(() => {
                expect(editor.textContent).toBe('');
            });
        });

        test('clear empties content the value prop never caught up to', async () => {
            const { root, editor, typeText } = await createEditor({
                value: '',
            });

            // Type without letting the debounce emit, so the `value` prop
            // (still '') never reflects the typed text — the scenario that
            // defeats a prop-based clear.
            typeText('hello');

            await root.clear();

            await vi.waitFor(() => {
                expect(editor.textContent).toBe('');
            });
        });

        test('clear discards the pending change so no stale change is emitted', async () => {
            const { root, editor, typeText, changes } = await createEditor({
                value: '',
            });

            typeText('hello');

            await root.clear();

            await vi.waitFor(() => {
                expect(editor.textContent).toBe('');
            });

            await sleep(DEBOUNCE_WAIT);
            expect(changes.some((change) => change.includes('hello'))).toBe(
                false
            );
        });

        test('clear does not emit a change event', async () => {
            const { root, changes } = await createEditor({ value: 'hello' });

            await root.clear();
            await sleep(DEBOUNCE_WAIT);

            expect(changes).toHaveLength(0);
        });
    });
});
