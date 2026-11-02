import { render, h } from '@stencil/vitest';

describe('limel-date-picker typed input', () => {
    beforeEach(() => {
        vi.useFakeTimers({
            toFake: ['Date'],
            now: new Date(2026, 10, 3, 15, 30),
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    async function setup(props: Record<string, any> = {}) {
        const { root, waitForChanges } = await render(
            <limel-date-picker type="date" {...props}></limel-date-picker>
        );
        await waitForChanges();

        const details: Array<Date | null> = [];
        root.addEventListener('change', (event: CustomEvent<Date | null>) => {
            details.push(event.detail);
        });

        return { root, waitForChanges, details };
    }

    const inputField = (root: any): HTMLLimelInputFieldElement =>
        root.shadowRoot.querySelector('limel-input-field');

    // The input field emits `change` with its text while the user types.
    function type(root: any, text: string) {
        inputField(root).dispatchEvent(
            new CustomEvent('change', { detail: text })
        );
    }

    function blur(root: any) {
        inputField(root).dispatchEvent(new Event('blur'));
    }

    function asLocalDateString(date: Date | null) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    it('does not emit while typing', async () => {
        const { root, waitForChanges, details } = await setup();

        type(root, '01/24/2026');
        await waitForChanges();

        expect(details).toEqual([]);
    });

    it('emits the typed date once when the field is blurred', async () => {
        const { root, waitForChanges, details } = await setup();

        type(root, '1/24/2026');
        blur(root);
        await waitForChanges();

        expect(details).toHaveLength(1);
        expect(asLocalDateString(details[0])).toBe('2026-1-24');
    });

    async function focus(root: any, waitForChanges: () => Promise<void>) {
        inputField(root).dispatchEvent(new Event('focus'));
        await waitForChanges();

        return inputField(root).shadowRoot.querySelector('input');
    }

    // Stencil's test window has no `onkeydown`, so `onKeyDown` listens for
    // `keyDown` here. Browsers fire, and Stencil listens for, `keydown`.
    function press(root: any, key: string) {
        const event = new KeyboardEvent('keyDown', {
            key: key,
            cancelable: true,
        });
        inputField(root).dispatchEvent(event);

        return event;
    }

    const pressEnter = (root: any) => press(root, 'Enter');

    it('commits on Enter and keeps focus in the field', async () => {
        const { root, waitForChanges, details } = await setup();
        const input = await focus(root, waitForChanges);
        const blurSpy = vi.spyOn(input, 'blur');

        input.value = '01/24/2026';
        type(root, '01/24/2026');
        pressEnter(root);
        await waitForChanges();

        expect(details).toHaveLength(1);
        expect(asLocalDateString(details[0])).toBe('2026-1-24');
        expect(blurSpy).not.toHaveBeenCalled();
    });

    it('emits null on Enter when the text of a set field is emptied', async () => {
        const { root, waitForChanges, details } = await setup({
            value: new Date(2026, 0, 24),
        });
        const input = await focus(root, waitForChanges);

        input.value = '';
        type(root, '');
        pressEnter(root);
        await waitForChanges();

        expect(details).toEqual([null]);
    });

    it('commits when the text loses focus inside the field, e.g. to the clear icon', async () => {
        const { root, waitForChanges, details } = await setup({
            value: new Date(2026, 0, 24),
        });
        const input = await focus(root, waitForChanges);

        type(root, '13/45/2026');
        input.dispatchEvent(new Event('blur'));
        await waitForChanges();

        expect(details).toEqual([]);
        expect(inputField(root).invalid).toBe(true);
    });

    it('drops the typed text on Escape', async () => {
        const { root, waitForChanges, details } = await setup({
            value: new Date(2026, 0, 24),
        });
        await focus(root, waitForChanges);

        type(root, '13/45/2026');
        const event = press(root, 'Escape');
        blur(root);
        await waitForChanges();

        expect(event.defaultPrevented).toBe(true);
        expect(details).toEqual([]);
        expect(inputField(root).value).toBe('01/24/2026');
        expect(inputField(root).invalid).toBe(false);
    });

    it('emits invalidInput when it starts and stops holding text that is not a date', async () => {
        const { root, waitForChanges } = await setup();
        const messages: Array<string | null> = [];
        root.addEventListener(
            'invalidInput',
            (event: CustomEvent<string | null>) => {
                messages.push(event.detail);
            }
        );

        type(root, 'not a date');
        blur(root);
        await waitForChanges();
        type(root, '01/24/2026');
        blur(root);
        await waitForChanges();

        expect(messages).toEqual(['Enter a valid date (11/03/2026)', null]);
    });

    it('keeps flagged text when the same date is passed again as a new object', async () => {
        const { root, waitForChanges } = await setup({
            value: new Date(2026, 0, 24),
        });

        type(root, 'not a date');
        blur(root);
        await waitForChanges();

        root.value = new Date(2026, 0, 24);
        await waitForChanges();

        expect(inputField(root).value).toBe('not a date');
        expect(inputField(root).invalid).toBe(true);
    });

    it('keeps focus and flags the text on Enter when it does not parse', async () => {
        const { root, waitForChanges, details } = await setup();
        const input = await focus(root, waitForChanges);
        const blurSpy = vi.spyOn(input, 'blur');

        input.value = 'not a date';
        type(root, 'not a date');
        pressEnter(root);
        await waitForChanges();

        expect(blurSpy).not.toHaveBeenCalled();
        expect(details).toEqual([]);
        expect(inputField(root).invalid).toBe(true);
    });

    it('does not flag half-typed text before it is committed', async () => {
        const { root, waitForChanges } = await setup();

        type(root, '01/2');
        await waitForChanges();

        expect(inputField(root).invalid).toBe(false);
    });

    it('keeps text that does not parse visible, flagged as invalid, without emitting', async () => {
        const { root, waitForChanges, details } = await setup();

        type(root, '13/45/2026');
        blur(root);
        await waitForChanges();

        expect(details).toEqual([]);
        expect(inputField(root).value).toBe('13/45/2026');
        expect(inputField(root).invalid).toBe(true);
        expect(inputField(root).helperText).toBe(
            'Enter a valid date (11/03/2026)'
        );
    });

    it('names a time, not a date, when a time field rejects the text', async () => {
        const { root, waitForChanges } = await setup({ type: 'time' });

        type(root, 'not a time');
        blur(root);
        await waitForChanges();

        expect(inputField(root).helperText).toBe(
            'Enter a valid time (3:30 PM)'
        );
    });

    it('shows only the given helper text while the text is valid', async () => {
        const { root, waitForChanges } = await setup();

        expect(inputField(root).helperText).toBeUndefined();

        root.helperText = 'When?';
        await waitForChanges();

        expect(inputField(root).helperText).toBe('When?');
    });

    it('emits null when the text of a set field is emptied', async () => {
        const { root, waitForChanges, details } = await setup({
            value: new Date(2026, 0, 24),
        });

        type(root, '');
        blur(root);
        await waitForChanges();

        expect(details).toEqual([null]);
    });

    it('does not emit when the committed text matches the current value', async () => {
        const { root, waitForChanges, details } = await setup({
            value: new Date(2026, 0, 24),
        });

        type(root, '01/24/2026');
        blur(root);
        await waitForChanges();

        expect(details).toEqual([]);
    });

    it('does not emit when the typed date is the current value, written differently', async () => {
        const { root, waitForChanges, details } = await setup({
            value: new Date(2026, 0, 24),
        });

        type(root, '1/24/2026');
        blur(root);
        await waitForChanges();

        expect(details).toEqual([]);
        expect(inputField(root).value).toBe('01/24/2026');
    });

    it('does not emit the same typed date again when the value is not echoed back', async () => {
        const { root, waitForChanges, details } = await setup();

        type(root, '1/24/2026');
        blur(root);
        await waitForChanges();
        blur(root);
        await waitForChanges();

        expect(details).toHaveLength(1);
    });

    it('keeps the typed text until the consumer echoes the value back', async () => {
        const { root, waitForChanges, details } = await setup();

        type(root, '1/24/2026');
        blur(root);
        await waitForChanges();

        expect(inputField(root).value).toBe('1/24/2026');

        root.value = details[0];
        await waitForChanges();

        expect(inputField(root).value).toBe('01/24/2026');
    });

    it('drops rejected text when the format changes', async () => {
        const { root, waitForChanges } = await setup();

        type(root, '13/45/2026');
        blur(root);
        await waitForChanges();

        root.format = 'YYYY-MM-DD';
        await waitForChanges();

        expect(inputField(root).value).toBe('');
        expect(inputField(root).invalid).toBe(false);
    });

    it('follows a change of language in the error message and in parsing', async () => {
        const { root, waitForChanges, details } = await setup();

        root.language = 'sv';
        await waitForChanges();

        type(root, 'not a date');
        blur(root);
        await waitForChanges();

        expect(inputField(root).helperText).toBe(
            'Ange ett giltigt datum (2026-11-03)'
        );

        type(root, '2026-01-24');
        blur(root);
        await waitForChanges();

        expect(asLocalDateString(details[0])).toBe('2026-1-24');
    });

    it('shows no placeholder unless one is given', async () => {
        const { root } = await setup();

        expect(inputField(root).placeholder).toBeUndefined();
    });

    describe('with a formatter but no format', () => {
        const formatter = (date: Date) => `Day ${date.getDate()}`;

        it('shows the formatted value while the field is focused', async () => {
            const { root, waitForChanges } = await setup({
                formatter: formatter,
                value: new Date(2026, 0, 24),
            });

            await focus(root, waitForChanges);

            expect(inputField(root).value).toBe('Day 24');
        });

        it('makes the text read-only, so nothing can be typed', async () => {
            const { root, waitForChanges, details } = await setup({
                formatter: formatter,
                value: new Date(2026, 0, 24),
            });
            const input = await focus(root, waitForChanges);

            type(root, '01/24/2026');
            blur(root);
            await waitForChanges();

            expect(input.readOnly).toBe(true);
            expect(details).toEqual([]);
            expect(inputField(root).value).toBe('Day 24');
            expect(inputField(root).invalid).toBe(false);
        });

        it('emits null on Backspace', async () => {
            const { root, waitForChanges, details } = await setup({
                formatter: formatter,
                value: new Date(2026, 0, 24),
            });
            await focus(root, waitForChanges);

            press(root, 'Backspace');
            await waitForChanges();

            expect(details).toEqual([null]);
        });
    });

    it('accepts typed text when a format is set along with the formatter', async () => {
        const { root, waitForChanges, details } = await setup({
            formatter: (date: Date) => `Day ${date.getDate()}`,
            format: 'YYYY-MM-DD',
        });

        type(root, '2026-01-24');
        blur(root);
        await waitForChanges();

        expect(asLocalDateString(details[0])).toBe('2026-1-24');
    });
});
