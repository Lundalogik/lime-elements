import { render, h } from '@stencil/vitest';
import { vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import {
    getAccessibleNodes,
    getAccessibleProperties,
    getInvalidStates,
} from '../../util/test/accessibility-tree';

describe('limel-text-editor', () => {
    async function createComponent(props: any = {}) {
        const {
            allowResize,
            contentType,
            disabled,
            helperText,
            inlineImages,
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
                inlineImages={inlineImages}
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

    function getContentEditable(root: HTMLElement): Promise<HTMLElement> {
        return vi.waitFor(() => {
            const contentEditable = getAdapter(root)?.shadowRoot?.querySelector(
                '.ProseMirror'
            ) as HTMLElement;
            expect(contentEditable).toBeTruthy();

            return contentEditable;
        });
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

    describe('editable area', () => {
        it('is a multiline textbox', async () => {
            const { root } = await createComponent();
            const editable = await getContentEditable(root);

            expect(await getAccessibleNodes('textbox')).toHaveLength(1);
            expect(editable.getAttribute('aria-multiline')).toBe('true');
        });

        it('is named by the label', async () => {
            const { root } = await createComponent({ label: 'Description' });
            await getContentEditable(root);

            const [textbox] = await getAccessibleNodes('textbox');
            expect(textbox.name).toBe('Description');
        });

        it('has no name when there is neither a label nor a placeholder', async () => {
            const { root } = await createComponent();
            await getContentEditable(root);

            const [textbox] = await getAccessibleNodes('textbox');
            expect(textbox.name).toBe('');
        });

        it('is named by the placeholder when there is no label', async () => {
            const { root } = await createComponent({
                placeholder: 'Write a comment',
            });
            const editable = await getContentEditable(root);

            const [textbox] = await getAccessibleNodes('textbox');
            expect(textbox.name).toBe('Write a comment');
            expect(editable.getAttribute('aria-label')).toBe('Write a comment');
        });

        it('is named by the label, not the placeholder, when there is both', async () => {
            const { root } = await createComponent({
                label: 'Comment',
                placeholder: 'Write a comment',
            });
            await getContentEditable(root);

            const [textbox] = await getAccessibleNodes('textbox');
            expect(textbox.name).toBe('Comment');
        });

        it('follows a change of the label', async () => {
            const { root, waitForChanges } = await createComponent({
                label: 'Description',
            });
            await getContentEditable(root);

            root.label = 'Summary';
            await waitForChanges();

            const [textbox] = await getAccessibleNodes('textbox');
            expect(textbox.name).toBe('Summary');
        });

        it('is described by the helper text', async () => {
            const { root } = await createComponent({
                label: 'Description',
                helperText: 'Keep it short',
            });
            await getContentEditable(root);

            const [textbox] = await getAccessibleNodes('textbox');
            expect(textbox.description).toBe('Keep it short');
        });

        it('has no description when there is no helper text', async () => {
            const { root } = await createComponent({ label: 'Description' });
            await getContentEditable(root);

            const [textbox] = await getAccessibleNodes('textbox');
            expect(textbox.description).toBe('');
        });

        it('follows a change of the helper text', async () => {
            const { root, waitForChanges } = await createComponent({
                helperText: 'Keep it short',
            });
            await getContentEditable(root);

            root.helperText = 'Keep it brief';
            await waitForChanges();

            const [textbox] = await getAccessibleNodes('textbox');
            expect(textbox.description).toBe('Keep it brief');
        });
    });

    describe('editable area state', () => {
        async function getProperties(root: HTMLElement) {
            await getContentEditable(root);
            const [properties] = await getAccessibleProperties('textbox');

            return properties;
        }

        it('is not required, disabled or invalid by default', async () => {
            const { root } = await createComponent();

            const properties = await getProperties(root);
            expect(properties.required).toBe(false);
            expect(properties.disabled).toBe(false);
            expect(properties.invalid).toBe(false);
        });

        it('is required when the editor is', async () => {
            const { root } = await createComponent({ required: true });
            const properties = await getProperties(root);

            expect(properties.required).toBe(true);
        });

        it('is disabled when the editor is', async () => {
            const { root } = await createComponent({ disabled: true });
            const editable = await getContentEditable(root);
            const properties = await getProperties(root);

            expect(properties.disabled).toBe(true);
            expect(editable.getAttribute('aria-disabled')).toBe('true');
        });

        it('is invalid when the editor is', async () => {
            const { root } = await createComponent({ invalid: true });
            await getContentEditable(root);

            expect(await getInvalidStates('textbox')).toEqual([true]);
        });

        it('follows a change of the invalid state', async () => {
            const { root, waitForChanges } = await createComponent({
                invalid: true,
            });
            await getContentEditable(root);

            root.invalid = false;
            await waitForChanges();

            expect(await getInvalidStates('textbox')).toEqual([false]);
        });

        it('follows a change of the required state', async () => {
            const { root, waitForChanges } = await createComponent({
                required: true,
            });
            await getContentEditable(root);

            root.required = false;
            await waitForChanges();

            const [properties] = await getAccessibleProperties('textbox');
            expect(properties.required).toBe(false);
        });

        it('follows a change of the disabled state', async () => {
            const { root, waitForChanges } = await createComponent();
            const editable = await getContentEditable(root);

            root.disabled = true;
            await waitForChanges();
            expect(editable.getAttribute('aria-disabled')).toBe('true');
            expect(editable.getAttribute('contenteditable')).toBe('false');

            root.disabled = false;
            await waitForChanges();
            expect(editable.hasAttribute('aria-disabled')).toBe(false);
            expect(editable.getAttribute('contenteditable')).toBe('true');
        });

        it('follows a change of the placeholder', async () => {
            const { root, waitForChanges } = await createComponent({
                label: 'Description',
                placeholder: 'Write here',
            });
            const editable = await getContentEditable(root);

            root.placeholder = 'Write there';
            await waitForChanges();

            expect(editable.getAttribute('aria-placeholder')).toBe(
                'Write there'
            );
        });

        it('has the placeholder', async () => {
            const { root } = await createComponent({
                placeholder: 'Write here',
            });
            const editable = await getContentEditable(root);

            expect(editable.getAttribute('aria-placeholder')).toBe(
                'Write here'
            );
        });

        it('is not set on the adapter', async () => {
            const { root } = await createComponent({
                disabled: true,
                invalid: true,
                placeholder: 'Write here',
                required: true,
            });
            await getContentEditable(root);

            const ariaAttributes = getAdapter(root)
                .getAttributeNames()
                .filter((name) => name.startsWith('aria-'));
            expect(ariaAttributes).toEqual([]);
        });
    });

    async function typeInto(root: HTMLElement) {
        const editable = await getContentEditable(root);
        editable.focus();
        await userEvent.keyboard('abc');

        return editable.textContent;
    }

    async function getToolbarButtons() {
        const buttons = await getAccessibleProperties('button');

        // The button that opens the menu of the items that do not fit is not
        // an item of the toolbar.
        return buttons.filter((button) => !button.hasPopup);
    }

    describe('when disabled', () => {
        it('does not accept typing', async () => {
            const { root } = await createComponent({ disabled: true });

            expect(await typeInto(root)).toBe('');
        });

        it('closes the link menu', async () => {
            const { root, waitForChanges } = await createComponent();
            await getContentEditable(root);
            getAdapter(root).dispatchEvent(
                new CustomEvent('open-editor-link-menu', {
                    detail: { href: 'https://example.com', text: 'Example' },
                })
            );
            await waitForChanges();
            await vi.waitFor(() => {
                expect(
                    document.querySelector('limel-text-editor-link-menu')
                ).not.toBeNull();
            });

            root.disabled = true;
            await waitForChanges();

            await vi.waitFor(() => {
                expect(
                    document.querySelector('limel-text-editor-link-menu')
                ).toBeNull();
            });
        });

        it('has a toolbar of disabled buttons', async () => {
            const { root } = await createComponent({ disabled: true });
            await getContentEditable(root);

            const buttons = await getToolbarButtons();
            expect(buttons.length).toBeGreaterThan(0);
            expect(buttons.every((button) => button.disabled)).toBe(true);
        });
    });

    describe('when enabled', () => {
        it('accepts typing', async () => {
            const { root } = await createComponent();

            expect(await typeInto(root)).toBe('abc');
        });

        it('has a toolbar with buttons that are not disabled', async () => {
            const { root } = await createComponent();
            await getContentEditable(root);

            const buttons = await getToolbarButtons();
            expect(buttons.some((button) => !button.disabled)).toBe(true);
        });
    });

    describe('focus while the disabled state changes', () => {
        function getFocusedElement(root: HTMLElement) {
            return getAdapter(root).shadowRoot.activeElement;
        }

        it('is given back when the editor is enabled again', async () => {
            const { root, waitForChanges } = await createComponent();
            const editable = await getContentEditable(root);
            editable.focus();
            expect(getFocusedElement(root)).toBe(editable);

            root.disabled = true;
            await waitForChanges();
            await vi.waitFor(() => {
                expect(getFocusedElement(root)).toBeNull();
            });

            root.disabled = false;
            await waitForChanges();

            expect(getFocusedElement(root)).toBe(editable);
        });

        it('is not taken when the editor did not have it', async () => {
            const { root, waitForChanges } = await createComponent();
            await getContentEditable(root);

            root.disabled = true;
            await waitForChanges();
            root.disabled = false;
            await waitForChanges();

            expect(getFocusedElement(root)).toBeNull();
        });

        it('is not taken from the element that has it when the editor is enabled again', async () => {
            const { root, waitForChanges } = await createComponent();
            const editable = await getContentEditable(root);
            editable.focus();
            root.disabled = true;
            await waitForChanges();
            const button = document.createElement('button');
            document.body.append(button);

            try {
                button.focus();

                root.disabled = false;
                await waitForChanges();

                expect(document.activeElement).toBe(button);
            } finally {
                button.remove();
            }
        });
    });

    describe('helper text', () => {
        it('is not pointed at by aria-controls', async () => {
            const { root } = await createComponent({
                helperText: 'Keep it short',
            });

            expect(getAdapter(root).hasAttribute('aria-controls')).toBe(false);
        });
    });

    describe('toolbar translations', () => {
        test('a menu-state update keeps the labels in the configured language', async () => {
            const { root, waitForChanges } = await render(
                <limel-text-editor language="sv" value="hej" />
            );
            await waitForChanges();

            const adapter = getAdapter(root);
            const actionBar = await vi.waitFor(() => {
                const bar = adapter.shadowRoot.querySelector(
                    'limel-action-bar'
                ) as any;
                expect(bar).toBeTruthy();

                return bar;
            });

            const bulletItem = () =>
                actionBar.actions.find(
                    (item: any) => item.value === 'bullet_list'
                );

            expect(bulletItem().text).toBe('Punktlista');

            actionBar.dispatchEvent(
                new CustomEvent('itemSelected', {
                    detail: { value: 'bullet_list' },
                })
            );
            await waitForChanges();

            await vi.waitFor(() => {
                expect(bulletItem().selected).toBe(true);
            });
            expect(bulletItem().text).toBe('Punktlista');
        });
    });

    describe('caret position on focus', () => {
        // The adapter restores a clicked position one tick after the focus
        // event; wait comfortably longer before asserting caret behavior.
        const FOCUS_SETTLE_WAIT = 50;

        const waitForFocusToSettle = () =>
            new Promise((resolve) => setTimeout(resolve, FOCUS_SETTLE_WAIT));

        async function createEditor(value: string) {
            const { root, waitForChanges, setProps } = await render(
                <limel-text-editor value={value} />
            );
            await waitForChanges();

            const editable = await vi.waitFor(() => {
                const contentEditable = getAdapter(
                    root
                )?.shadowRoot?.querySelector('.ProseMirror') as HTMLElement;
                expect(contentEditable).toBeTruthy();

                return contentEditable;
            });

            const mouseDownAtTextOffset = (
                offset: number,
                side: 'before' | 'after' = 'before'
            ) => {
                const textNode = editable.querySelector('p').firstChild as Text;
                const range = document.createRange();
                range.setStart(textNode, offset);
                range.setEnd(textNode, offset + 1);
                const rect = range.getBoundingClientRect();
                const clientX =
                    side === 'before' ? rect.left + 1 : rect.right - 1;
                editable.dispatchEvent(
                    new MouseEvent('mousedown', {
                        bubbles: true,
                        composed: true,
                        button: 0,
                        clientX,
                        clientY: rect.top + rect.height / 2,
                    })
                );
            };

            const typeText = (text: string) => {
                document.execCommand('insertText', false, text);
            };

            return {
                root: root as HTMLLimelTextEditorElement,
                setProps,
                editable,
                mouseDownAtTextOffset,
                typeText,
            };
        }

        test('regaining focus without a click keeps the caret where typing left it', async () => {
            const { editable, mouseDownAtTextOffset, typeText } =
                await createEditor('hello');

            // Click on the first character to focus the editor; the adapter
            // records the clicked position.
            mouseDownAtTextOffset(0);
            editable.focus();
            await waitForFocusToSettle();

            typeText('ABC');
            expect(editable.textContent).toBe('ABChello');

            // Losing and regaining focus without a click (e.g. switching
            // windows) must not move the caret back to the clicked position.
            editable.blur();
            await waitForFocusToSettle();
            editable.focus();
            await waitForFocusToSettle();

            typeText('!');
            expect(editable.textContent).toBe('ABC!hello');
        });

        test('clicking a blurred editor places the caret at the clicked position', async () => {
            const { editable, mouseDownAtTextOffset, typeText } =
                await createEditor('hello');

            editable.focus();
            await waitForFocusToSettle();
            editable.blur();
            await waitForFocusToSettle();

            mouseDownAtTextOffset('hello'.length - 1, 'after');
            editable.focus();
            await waitForFocusToSettle();

            typeText('!');
            expect(editable.textContent).toBe('hello!');
        });

        test('unmounting the editor right after a click-to-focus does not touch the destroyed view', async () => {
            const { root, editable, mouseDownAtTextOffset } =
                await createEditor('hello');

            const errors: string[] = [];
            const onError = (event: ErrorEvent) => {
                errors.push(event.message);
            };
            window.addEventListener('error', onError);

            try {
                // Click to focus, then remove the editor in the same tick —
                // like a popover closing on the click that focused it. The
                // pending focus restoration must not run against the
                // destroyed editor view.
                mouseDownAtTextOffset(0);
                editable.focus();
                root.remove();
                await waitForFocusToSettle();

                expect(errors).toEqual([]);
            } finally {
                window.removeEventListener('error', onError);
            }
        });

        test('a click position beyond a shrunken document is ignored on focus', async () => {
            const value = 'hello world, hello world';
            const { setProps, editable, mouseDownAtTextOffset, typeText } =
                await createEditor(value);

            const errors: string[] = [];
            const onError = (event: ErrorEvent) => {
                errors.push(event.message);
            };
            window.addEventListener('error', onError);

            try {
                // Record a click position at the end of the text, then shrink
                // the document below that position before focus is granted.
                mouseDownAtTextOffset(value.length - 1, 'after');
                await setProps({ value: '' });
                await vi.waitFor(() => {
                    expect(editable.textContent).toBe('');
                });

                editable.focus();
                await waitForFocusToSettle();

                typeText('!');
                expect(editable.textContent).toBe('!');
                expect(errors).toEqual([]);
            } finally {
                window.removeEventListener('error', onError);
            }
        });
    });

    describe('change event handling', () => {
        // Comfortably longer than the editor's 300 ms change debounce.
        const DEBOUNCE_WAIT = 500;

        const waitForDebounce = () =>
            new Promise((resolve) => setTimeout(resolve, DEBOUNCE_WAIT));

        async function createEditor(props: any = {}) {
            const { root, waitForChanges, setProps } = await render(
                <limel-text-editor value={props.value} />
            );
            await waitForChanges();

            const editor = await getContentEditable(root);

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

            await waitForDebounce();
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

            await waitForDebounce();
            expect(changes).toHaveLength(1);
        });

        test('flushPendingChanges emits nothing when no change is pending', async () => {
            const { root, changes } = await createEditor({ value: 'hello' });

            await root.flushPendingChanges();
            await waitForDebounce();
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

            await waitForDebounce();
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

            await waitForDebounce();
            expect(changes.some((change) => change.includes('hello'))).toBe(
                false
            );
        });

        test('clear does not emit a change event', async () => {
            const { root, changes } = await createEditor({ value: 'hello' });

            await root.clear();
            await waitForDebounce();

            expect(changes).toHaveLength(0);
        });
    });

    describe('image paste', () => {
        async function createEditor(props: any = {}) {
            const { root } = await createComponent(props);
            const editable = await getContentEditable(root);

            const imagePasted = vi.fn();
            root.addEventListener('imagePasted', imagePasted);

            return { editable, imagePasted };
        }

        function pasteImageFile(editable: HTMLElement) {
            const clipboardData = new DataTransfer();
            clipboardData.items.add(
                new File(['png-bytes'], 'cat.png', { type: 'image/png' })
            );

            editable.dispatchEvent(
                new ClipboardEvent('paste', {
                    clipboardData: clipboardData,
                    bubbles: true,
                    cancelable: true,
                })
            );
        }

        test('pasting an image emits imagePasted when inline images are not configured', async () => {
            const { editable, imagePasted } = await createEditor();

            pasteImageFile(editable);

            await vi.waitFor(() => {
                expect(imagePasted).toHaveBeenCalledTimes(1);
            });
        });

        test('pasting an image never emits imagePasted when inline images are configured', async () => {
            const upload = vi
                .fn()
                .mockResolvedValue('https://example.com/cat.png');
            const { editable, imagePasted } = await createEditor({
                inlineImages: { upload: upload },
            });

            pasteImageFile(editable);

            // The upload call and the legacy event sit on the same branch
            // point after the file is read; once upload has run, a
            // suppression failure would already have emitted the event.
            await vi.waitFor(() => {
                expect(upload).toHaveBeenCalledTimes(1);
            });
            expect(imagePasted).not.toHaveBeenCalled();
        });
    });
});
