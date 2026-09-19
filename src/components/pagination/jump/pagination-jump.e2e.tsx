import { render, h } from '@stencil/vitest';

// The field this component wraps is built on Material's text field, which
// the mock DOM used by `*.spec.tsx` cannot host inside another component.
// These run in a real browser instead — still against the component on its
// own, with no popover or portal in the way.
describe('limel-pagination-jump', () => {
    let rendered: { unmount: () => void } | undefined;

    // A popover leaves behind the container it moved its content into, so it
    // goes too; otherwise the next test can find this one's.
    afterEach(() => {
        rendered?.unmount();
        rendered = undefined;

        for (const container of document.querySelectorAll(
            '.limel-portal--container'
        )) {
            container.remove();
        }
    });

    async function setup(props: Record<string, any> = {}) {
        const jumps: number[] = [];
        const result = await render(
            <limel-pagination-jump
                open={true}
                page={50}
                pageCount={492}
                {...props}
                onJump={(event: CustomEvent<number>) =>
                    jumps.push(event.detail)
                }
            ></limel-pagination-jump>
        );
        rendered = result;

        const { root, waitForChanges } = result;
        await waitForChanges();

        return { root, waitForChanges, jumps };
    }

    type Root = HTMLLimelPaginationJumpElement;

    const field = (root: Root): HTMLLimelInputFieldElement =>
        root.shadowRoot?.querySelector('limel-input-field');
    const goButton = (root: Root): HTMLLimelButtonElement =>
        root.shadowRoot?.querySelector('limel-button');
    const nativeField = (root: Root): HTMLInputElement =>
        field(root)?.shadowRoot?.querySelector('input');

    // As a user changes it: the field emits its own `change` on a debounce,
    // which is exactly what the component is written not to depend on.
    const type = async (
        root: Root,
        value: string,
        waitForChanges: () => Promise<void>
    ) => {
        const input = nativeField(root);
        input.value = value;
        input.dispatchEvent(
            new Event('input', { bubbles: true, composed: true })
        );
        await waitForChanges();
    };

    describe('what it draws', () => {
        test('draws nothing until it is opened', async () => {
            const { root } = await setup({ open: false });

            expect(field(root)).toBeNull();
        });

        test('starts from the page the user is on', async () => {
            // Both the sensible default and the thing you want to edit: from
            // 50, reaching 55 is two keystrokes and reaching 1 is one.
            const { root } = await setup();

            expect(field(root).value).toBe('50');
        });

        test('says which pages the set has', async () => {
            const { root } = await setup();

            expect(field(root).placeholder).toBe('1–492');
        });

        test('goes on showing what was typed once the keyboard leaves it', async () => {
            // The field draws an unfocused number from its `value` prop, so
            // pinning that to the page it opened with would show that again
            // the moment the keyboard moved to the button.
            const { root, waitForChanges } = await setup();

            await type(root, '300', waitForChanges);
            nativeField(root).dispatchEvent(
                new Event('change', { bubbles: true, composed: true })
            );
            await waitForChanges();

            expect(field(root).value).toBe('300');
        });

        test('starts again from the page in front of the user when reopened', async () => {
            // Rather than offering whatever was last typed, which was about a
            // set the user may since have moved through.
            const { root, waitForChanges } = await setup();

            await type(root, '300', waitForChanges);
            root.open = false;
            await waitForChanges();
            root.page = 7;
            root.open = true;
            await waitForChanges();

            expect(field(root).value).toBe('7');
        });
    });

    describe('what it asks for', () => {
        test('asks for the page that was typed', async () => {
            const { root, waitForChanges, jumps } = await setup();

            await type(root, '300', waitForChanges);
            goButton(root).click();

            expect(jumps).toEqual([300]);
        });

        test('asks on Enter, without waiting for the field to settle', async () => {
            // The field reports what is in it on a debounce. Reading it
            // directly is what keeps a page typed and submitted quickly from
            // being submitted as whatever preceded it.
            const { root, waitForChanges, jumps } = await setup();

            await type(root, '7', waitForChanges);
            nativeField(root).dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Enter',
                    bubbles: true,
                    composed: true,
                })
            );

            expect(jumps).toEqual([7]);
        });

        test('asks for the nearest page that exists rather than refusing', async () => {
            const { root, waitForChanges, jumps } = await setup();

            await type(root, '9999', waitForChanges);
            goButton(root).click();

            expect(jumps).toEqual([492]);
        });

        test('has nothing to ask for when the field is empty', async () => {
            const { root, waitForChanges, jumps } = await setup();

            await type(root, '', waitForChanges);
            goButton(root).click();

            expect(jumps).toEqual([]);
        });

        test('asks again once a page is typed after the field was emptied', async () => {
            // Nothing latches on an empty field, so emptying it does not
            // strand the form in a state it cannot be submitted from.
            const { root, waitForChanges, jumps } = await setup();

            await type(root, '', waitForChanges);
            await type(root, '7', waitForChanges);
            goButton(root).click();

            expect(jumps).toEqual([7]);
        });

        test('asks for nothing while a page is loading', async () => {
            const { root, waitForChanges, jumps } = await setup({
                loading: true,
            });

            await type(root, '300', waitForChanges);
            goButton(root).click();

            expect(goButton(root).disabled).toBe(true);
            expect(jumps).toEqual([]);
        });
    });

    describe('the language it uses', () => {
        test('writes its labels in the given language', async () => {
            const { root } = await setup({ language: 'sv' });

            expect(goButton(root).label).toBe('Gå');
        });

        test('keeps drawing when the language cannot be used', async () => {
            // The pagination that owns this one is what complains about a bad
            // language; this one only has to keep working.
            const { root } = await setup({ language: 'en_US' as any });

            expect(field(root).placeholder).toBe('1–492');
        });
    });
});
