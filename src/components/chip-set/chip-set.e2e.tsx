import { render, h } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';
import {
    getAccessibleNodes,
    getAccessibleProperties,
    getInvalidStates,
    getRequiredStates,
} from '../../util/test/accessibility-tree';

describe('limel-chip-set', () => {
    describe('basic chip set', () => {
        function getValue() {
            return [
                { id: '1', text: 'Lime' },
                { id: '2', text: 'Apple' },
            ];
        }

        it('renders the label', async () => {
            const { root, waitForChanges } = await render(
                <limel-chip-set
                    label="Fruit"
                    value={getValue()}
                ></limel-chip-set>
            );
            await waitForChanges();

            const label = root.shadowRoot!.querySelector(
                '.limel-notched-outline--notch label'
            );
            expect(label).not.toBeNull();
            expect(label!.textContent).toEqual('Fruit');
        });

        it('renders the chips', async () => {
            const { root, waitForChanges } = await render(
                <limel-chip-set
                    label="Fruit"
                    value={getValue()}
                ></limel-chip-set>
            );
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            expect(chips.length).toEqual(2);
            expect(chips[0].getAttribute('text')).toEqual('Lime');
            expect(chips[1].getAttribute('text')).toEqual('Apple');
        });

        it('emits an interact event when a chip is clicked', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-chip-set
                    label="Fruit"
                    value={getValue()}
                ></limel-chip-set>
            );
            const interactSpy = spyOnEvent('interact');
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            (chips[0] as HTMLElement).click();
            await waitForChanges();

            expect(interactSpy).toHaveReceivedEventTimes(1);
            expect(interactSpy).toHaveReceivedEventDetail({
                id: '1',
                text: 'Lime',
            });
        });
    });

    describe('choice chip set', () => {
        function getValue() {
            return [
                { id: '1', text: 'Lime', selected: true },
                { id: '2', text: 'Apple' },
            ];
        }

        it('does not render the label', async () => {
            const { root, waitForChanges } = await render(
                <limel-chip-set
                    type="choice"
                    value={getValue()}
                ></limel-chip-set>
            );
            await waitForChanges();

            const label = root.shadowRoot!.querySelector('.chip-set__label');
            expect(label).toBeNull();
        });

        it('renders the chips correctly', async () => {
            const { root, waitForChanges } = await render(
                <limel-chip-set
                    type="choice"
                    value={getValue()}
                ></limel-chip-set>
            );
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            expect(chips.length).toEqual(2);
            expect(chips[0].getAttribute('text')).toEqual('Lime');
            expect(chips[1].getAttribute('text')).toEqual('Apple');
        });

        it('emits change event when the first chip is clicked', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-chip-set
                    type="choice"
                    value={getValue()}
                ></limel-chip-set>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            (chips[0] as HTMLElement).click();
            await waitForChanges();

            expect(changeSpy).toHaveReceivedEventTimes(1);
            expect(changeSpy).toHaveReceivedEventDetail({
                id: '1',
                text: 'Lime',
                selected: false,
            });
        });

        it('emits change event when the second chip is clicked', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-chip-set
                    type="choice"
                    value={getValue()}
                ></limel-chip-set>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            (chips[1] as HTMLElement).click();
            await waitForChanges();

            expect(changeSpy).toHaveReceivedEventTimes(1);
            expect(changeSpy).toHaveReceivedEventDetail({
                id: '2',
                text: 'Apple',
                selected: true,
            });
        });
    });

    describe('filter chip set', () => {
        function getValue() {
            return [
                { id: '1', text: 'Lime', selected: true },
                { id: '2', text: 'Apple' },
            ];
        }

        it('renders the chips correctly', async () => {
            const { root, waitForChanges } = await render(
                <limel-chip-set
                    type="filter"
                    value={getValue()}
                ></limel-chip-set>
            );
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            expect(chips.length).toEqual(2);
            expect(chips[0].getAttribute('text')).toEqual('Lime');
            expect(chips[1].getAttribute('text')).toEqual('Apple');

            expect(chips[0].hasAttribute('selected')).toBe(true);
            expect(chips[1].hasAttribute('selected')).toBe(false);
        });

        it('emits change event to deselect when first chip is clicked', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-chip-set
                    type="filter"
                    value={getValue()}
                ></limel-chip-set>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            (chips[0] as HTMLElement).click();
            await waitForChanges();

            expect(changeSpy).toHaveReceivedEventTimes(1);
            expect(changeSpy).toHaveReceivedEventDetail({
                id: '1',
                text: 'Lime',
                selected: false,
            });
        });

        it('emits change event to select when second chip is clicked', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-chip-set
                    type="filter"
                    value={getValue()}
                ></limel-chip-set>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            (chips[1] as HTMLElement).click();
            await waitForChanges();

            expect(changeSpy).toHaveReceivedEventTimes(1);
            expect(changeSpy).toHaveReceivedEventDetail({
                id: '2',
                text: 'Apple',
                selected: true,
            });
        });
    });

    describe('input chip set', () => {
        function getValue() {
            return [
                { id: '1', text: 'Lime', removable: true },
                { id: '2', text: 'Apple' },
            ];
        }

        it('renders the chips correctly', async () => {
            const { root, waitForChanges } = await render(
                <limel-chip-set
                    type="input"
                    value={getValue()}
                ></limel-chip-set>
            );
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            expect(chips.length).toEqual(2);
            expect(chips[0].getAttribute('text')).toEqual('Lime');
            expect(chips[1].getAttribute('text')).toEqual('Apple');
        });

        it('emits interact event when a chip is clicked', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-chip-set
                    type="input"
                    value={getValue()}
                ></limel-chip-set>
            );
            const interactSpy = spyOnEvent('interact');
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            (chips[0] as HTMLElement).click();
            await waitForChanges();

            expect(interactSpy).toHaveReceivedEventTimes(1);
            expect(interactSpy).toHaveReceivedEventDetail({
                id: '1',
                text: 'Lime',
                removable: true,
            });
        });

        it('emits startEdit event when input receives focus', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-chip-set
                    type="input"
                    value={getValue()}
                ></limel-chip-set>
            );
            const startEditSpy = spyOnEvent('startEdit');
            await waitForChanges();

            const input = root.shadowRoot!.querySelector('input');
            input!.focus();
            await waitForChanges();

            expect(startEditSpy).toHaveReceivedEventTimes(1);
        });

        it('does not emit startEdit event when a chip is clicked', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-chip-set
                    type="input"
                    value={getValue()}
                ></limel-chip-set>
            );
            const startEditSpy = spyOnEvent('startEdit');
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            (chips[0] as HTMLElement).click();
            await waitForChanges();

            expect(startEditSpy).toHaveReceivedEventTimes(0);
        });

        describe('when disabled', () => {
            it('hides the remove button on removable chips', async () => {
                const { root, waitForChanges } = await render(
                    <limel-chip-set
                        type="input"
                        disabled={true}
                        value={getValue()}
                    ></limel-chip-set>
                );
                await waitForChanges();

                const chips = root.shadowRoot!.querySelectorAll('limel-chip');
                const firstChip = chips[0];
                const removeButton =
                    firstChip.shadowRoot?.querySelector('.remove-button');
                expect(removeButton).toBeNull();
            });
        });

        describe('when readonly', () => {
            it('hides the remove button on removable chips', async () => {
                const { root, waitForChanges } = await render(
                    <limel-chip-set
                        type="input"
                        readonly={true}
                        value={getValue()}
                    ></limel-chip-set>
                );
                await waitForChanges();

                const chips = root.shadowRoot!.querySelectorAll('limel-chip');
                const firstChip = chips[0];
                const removeButton =
                    firstChip.shadowRoot?.querySelector('.remove-button');
                expect(removeButton).toBeNull();
            });
        });

        describe('emptyInputOnChange', () => {
            async function typeIntoInput(
                root: HTMLLimelChipSetElement,
                waitForChanges: () => Promise<void>
            ) {
                const input = root.shadowRoot!.querySelector('input')!;
                input.value = 'pending';
                input.dispatchEvent(
                    new Event('input', { bubbles: true, composed: true })
                );
                await waitForChanges();
            }

            it('clears the input when chips change (default)', async () => {
                const { root, waitForChanges } = await render(
                    <limel-chip-set
                        type="input"
                        value={getValue()}
                    ></limel-chip-set>
                );
                await waitForChanges();

                await typeIntoInput(root, waitForChanges);
                root.value = [...getValue(), { id: '3', text: 'Cherry' }];
                await waitForChanges();

                const input = root.shadowRoot!.querySelector('input')!;
                expect(input.value).toEqual('');
            });

            it('preserves the input when chips change and emptyInputOnChange is false', async () => {
                const { root, waitForChanges } = await render(
                    <limel-chip-set
                        type="input"
                        value={getValue()}
                        emptyInputOnChange={false}
                    ></limel-chip-set>
                );
                await waitForChanges();

                await typeIntoInput(root, waitForChanges);
                root.value = [...getValue(), { id: '3', text: 'Cherry' }];
                await waitForChanges();

                const input = root.shadowRoot!.querySelector('input')!;
                expect(input.value).toEqual('pending');
            });
        });
    });
});

describe('limel-chip-set accessible description', () => {
    it('of an input chip set is the helper text', async () => {
        const { waitForChanges } = await render(
            <limel-chip-set
                type="input"
                label="Tags"
                helperText="Press enter to add a tag"
                value={[]}
            />
        );
        await waitForChanges();

        expect(await getAccessibleNodes('textbox')).toEqual([
            { name: 'Tags', description: 'Press enter to add a tag' },
        ]);
    });

    it('of a filter chip set is the helper text', async () => {
        const { waitForChanges } = await render(
            <limel-chip-set
                type="filter"
                label="Fruit"
                helperText="Pick the ones you like"
                value={[{ id: '1', text: 'Lime' }]}
            />
        );
        await waitForChanges();

        const grids = await getAccessibleNodes('grid');
        expect(grids.map((grid) => grid.description)).toEqual([
            'Pick the ones you like',
        ]);
    });
});

describe('limel-chip-set invalid state', () => {
    it('of an input chip set is not invalid by default', async () => {
        const { waitForChanges } = await render(
            <limel-chip-set type="input" label="Tags" value={[]} />
        );
        await waitForChanges();

        expect(await getInvalidStates('textbox')).toEqual([false]);
    });

    it('of an input chip set is invalid when the chip set is', async () => {
        const { waitForChanges } = await render(
            <limel-chip-set
                type="input"
                label="Tags"
                value={[]}
                invalid={true}
            />
        );
        await waitForChanges();

        expect(await getInvalidStates('textbox')).toEqual([true]);
    });

    it('of an input chip set is invalid when it is required, empty and has lost the focus', async () => {
        const { root, waitForChanges } = await render(
            <limel-chip-set
                type="input"
                label="Tags"
                value={[]}
                required={true}
            />
        );
        await waitForChanges();
        expect(await getInvalidStates('textbox')).toEqual([false]);
        const input = root.shadowRoot.querySelector('input');

        input.focus();
        input.blur();
        await waitForChanges();

        expect(await getInvalidStates('textbox')).toEqual([true]);
    });

    it('of an input chip set is not invalid when it becomes read-only', async () => {
        const { root, waitForChanges } = await render(
            <limel-chip-set
                type="input"
                label="Tags"
                value={[]}
                required={true}
            />
        );
        await waitForChanges();
        const input = root.shadowRoot.querySelector('input');
        input.focus();
        input.blur();
        await waitForChanges();
        expect(await getInvalidStates('textbox')).toEqual([true]);

        (root as HTMLLimelChipSetElement).readonly = true;
        await waitForChanges();

        expect(await getInvalidStates('textbox')).toEqual([false]);
    });

    it('of a read-only input chip set is invalid when the chip set is', async () => {
        const { waitForChanges } = await render(
            <limel-chip-set
                type="input"
                label="Tags"
                value={[]}
                readonly={true}
                invalid={true}
            />
        );
        await waitForChanges();

        expect(await getInvalidStates('textbox')).toEqual([true]);
    });
});

describe('limel-chip-set required state', () => {
    it('of an input chip set is not required by default', async () => {
        const { waitForChanges } = await render(
            <limel-chip-set type="input" label="Tags" value={[]} />
        );
        await waitForChanges();

        expect(await getRequiredStates('textbox')).toEqual([false]);
    });

    it('of an input chip set is required when the chip set is', async () => {
        const { waitForChanges } = await render(
            <limel-chip-set
                type="input"
                label="Tags"
                value={[]}
                required={true}
            />
        );
        await waitForChanges();

        expect(await getRequiredStates('textbox')).toEqual([true]);
    });

    it('of an input chip set that has chips is required when the chip set is', async () => {
        const { waitForChanges } = await render(
            <limel-chip-set
                type="input"
                label="Tags"
                value={[{ id: 'one', text: 'One' }]}
                required={true}
            />
        );
        await waitForChanges();

        expect(await getRequiredStates('textbox')).toEqual([true]);
    });

    it('of an input chip set is not required anymore when the chip set stops being', async () => {
        const { root, waitForChanges } = await render(
            <limel-chip-set
                type="input"
                label="Tags"
                value={[]}
                required={true}
            />
        );
        await waitForChanges();
        expect(await getRequiredStates('textbox')).toEqual([true]);

        (root as HTMLLimelChipSetElement).required = false;
        await waitForChanges();

        expect(await getRequiredStates('textbox')).toEqual([false]);
    });
});

describe('limel-chip-set readonly state', () => {
    const chips = [
        { id: 'one', text: 'One' },
        { id: 'two', text: 'Two' },
    ];

    const renderReadonlyChipSet = () =>
        render(
            <limel-chip-set
                type="input"
                label="Tags"
                value={chips}
                readonly={true}
            />
        );

    const getInput = (root: HTMLElement) =>
        root.shadowRoot.querySelector('input');

    it('of an input chip set is announced as read only, and not as disabled', async () => {
        const { waitForChanges } = await renderReadonlyChipSet();
        await waitForChanges();

        expect(await getAccessibleProperties('textbox')).toEqual([
            expect.objectContaining({ readonly: true, disabled: false }),
        ]);
    });

    it('of an input chip set can be reached with the keyboard', async () => {
        const { root, waitForChanges } = await renderReadonlyChipSet();
        await waitForChanges();

        getInput(root).focus();

        expect(getInput(root).tabIndex).toBe(0);
        expect(root.shadowRoot.activeElement).toBe(getInput(root));
    });

    it('of an input chip set ends the editing when it becomes read only while the user is editing', async () => {
        const { root, waitForChanges, spyOnEvent } = await render(
            <limel-chip-set type="input" label="Tags" value={chips} />
        );
        const stopEditSpy = spyOnEvent('stopEdit');
        await waitForChanges();
        getInput(root).focus();
        await waitForChanges();
        expect(await root.getEditMode()).toBe(true);

        root.readonly = true;
        await waitForChanges();

        expect(await root.getEditMode()).toBe(false);
        expect(stopEditSpy).toHaveReceivedEventTimes(1);
    });

    it('of an input chip set starts editing when it stops being read only while the input has focus', async () => {
        const { root, waitForChanges, spyOnEvent } =
            await renderReadonlyChipSet();
        const startEditSpy = spyOnEvent('startEdit');
        await waitForChanges();
        getInput(root).focus();
        await waitForChanges();
        expect(await root.getEditMode()).toBe(false);

        root.readonly = false;
        await waitForChanges();

        expect(await root.getEditMode()).toBe(true);
        expect(startEditSpy).toHaveReceivedEventTimes(1);
    });

    it('of an input chip set does not pull the focus back after it became read only', async () => {
        const { root, waitForChanges } = await render(
            <limel-chip-set type="input" label="Tags" value={chips} />
        );
        await waitForChanges();
        getInput(root).focus();
        await waitForChanges();
        root.readonly = true;
        await waitForChanges();
        getInput(root).blur();

        root.label = 'Labels';
        await waitForChanges();

        expect(root.shadowRoot.activeElement).toBeNull();
    });

    it('of an input chip set cannot be typed in', async () => {
        const { root, waitForChanges, spyOnEvent } =
            await renderReadonlyChipSet();
        const inputSpy = spyOnEvent('input');
        await waitForChanges();

        getInput(root).focus();
        await userEvent.keyboard('abc');
        await waitForChanges();

        expect(getInput(root).value).toBe('');
        expect(inputSpy).not.toHaveReceivedEvent();
    });

    it.each(['{Backspace}{Backspace}', '{ArrowLeft}{Delete}'])(
        'of an input chip set does not remove a chip when %s is pressed',
        async (keys) => {
            const { root, waitForChanges, spyOnEvent } =
                await renderReadonlyChipSet();
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            getInput(root).focus();
            await userEvent.keyboard(keys);
            await waitForChanges();

            expect(changeSpy).not.toHaveReceivedEvent();
            expect(root.shadowRoot.querySelectorAll('limel-chip')).toHaveLength(
                2
            );
        }
    );

    it('of an input chip set does not start or stop editing when it gets and loses focus', async () => {
        const { root, waitForChanges, spyOnEvent } =
            await renderReadonlyChipSet();
        const startEditSpy = spyOnEvent('startEdit');
        const stopEditSpy = spyOnEvent('stopEdit');
        await waitForChanges();

        getInput(root).focus();
        getInput(root).blur();
        await waitForChanges();

        expect(startEditSpy).not.toHaveReceivedEvent();
        expect(stopEditSpy).not.toHaveReceivedEvent();
    });

    it('of an input chip set stays disabled when it is disabled', async () => {
        const { root, waitForChanges } = await render(
            <limel-chip-set
                type="input"
                label="Tags"
                value={chips}
                disabled={true}
            />
        );
        await waitForChanges();

        getInput(root).focus();

        expect(await getAccessibleProperties('textbox')).toEqual([
            expect.objectContaining({ readonly: false, disabled: true }),
        ]);
        expect(root.shadowRoot.activeElement).toBeNull();
    });
});
