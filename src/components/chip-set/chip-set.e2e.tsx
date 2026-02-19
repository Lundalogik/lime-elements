import { render, h } from '@stencil/vitest';

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
            const handleInteract = vi.fn();
            const { root, waitForChanges } = await render(
                <limel-chip-set
                    label="Fruit"
                    value={getValue()}
                    onInteract={handleInteract}
                ></limel-chip-set>
            );
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            (chips[0] as HTMLElement).click();
            await waitForChanges();

            expect(handleInteract).toHaveBeenCalledTimes(1);
            expect(handleInteract.mock.calls[0][0].detail).toEqual(
                expect.objectContaining({
                    id: '1',
                    text: 'Lime',
                })
            );
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
            const handleChange = vi.fn();
            const { root, waitForChanges } = await render(
                <limel-chip-set
                    type="choice"
                    value={getValue()}
                    onChange={handleChange}
                ></limel-chip-set>
            );
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            (chips[0] as HTMLElement).click();
            await waitForChanges();

            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange.mock.calls[0][0].detail).toEqual(
                expect.objectContaining({
                    id: '1',
                    text: 'Lime',
                    selected: false,
                })
            );
        });

        it('emits change event when the second chip is clicked', async () => {
            const handleChange = vi.fn();
            const { root, waitForChanges } = await render(
                <limel-chip-set
                    type="choice"
                    value={getValue()}
                    onChange={handleChange}
                ></limel-chip-set>
            );
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            (chips[1] as HTMLElement).click();
            await waitForChanges();

            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange.mock.calls[0][0].detail).toEqual(
                expect.objectContaining({
                    id: '2',
                    text: 'Apple',
                    selected: true,
                })
            );
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
            const handleChange = vi.fn();
            const { root, waitForChanges } = await render(
                <limel-chip-set
                    type="filter"
                    value={getValue()}
                    onChange={handleChange}
                ></limel-chip-set>
            );
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            (chips[0] as HTMLElement).click();
            await waitForChanges();

            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange.mock.calls[0][0].detail).toEqual(
                expect.objectContaining({
                    id: '1',
                    text: 'Lime',
                    selected: false,
                })
            );
        });

        it('emits change event to select when second chip is clicked', async () => {
            const handleChange = vi.fn();
            const { root, waitForChanges } = await render(
                <limel-chip-set
                    type="filter"
                    value={getValue()}
                    onChange={handleChange}
                ></limel-chip-set>
            );
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            (chips[1] as HTMLElement).click();
            await waitForChanges();

            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange.mock.calls[0][0].detail).toEqual(
                expect.objectContaining({
                    id: '2',
                    text: 'Apple',
                    selected: true,
                })
            );
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
            const handleInteract = vi.fn();
            const { root, waitForChanges } = await render(
                <limel-chip-set
                    type="input"
                    value={getValue()}
                    onInteract={handleInteract}
                ></limel-chip-set>
            );
            await waitForChanges();

            const chips = root.shadowRoot!.querySelectorAll('limel-chip');
            (chips[0] as HTMLElement).click();
            await waitForChanges();

            expect(handleInteract).toHaveBeenCalledTimes(1);
            expect(handleInteract.mock.calls[0][0].detail).toEqual(
                expect.objectContaining({
                    id: '1',
                    text: 'Lime',
                    removable: true,
                })
            );
        });
    });
});
