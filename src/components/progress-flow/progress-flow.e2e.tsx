import { render, h } from '@stencil/vitest';

describe('limel-progress-flow', () => {
    it('renders the component without any steps', async () => {
        const { root, waitForChanges } = await render(
            <limel-progress-flow></limel-progress-flow>
        );
        await waitForChanges();
        expect(root).toBeTruthy();
    });

    describe('when the progress flow contains three steps', () => {
        const flowItems = [
            { text: 'Customer contact' },
            { text: 'Demand analysis', selected: true },
            { text: 'Agreement' },
        ];

        let root: HTMLElement;
        let waitForChanges: () => Promise<void>;

        beforeEach(async () => {
            const result = await render(
                <limel-progress-flow
                    flowItems={flowItems}
                ></limel-progress-flow>
            );
            root = result.root;
            waitForChanges = result.waitForChanges;
            await waitForChanges();
        });

        it('renders the first step correctly', () => {
            const items = root.shadowRoot!.querySelectorAll(
                'limel-progress-flow-item'
            );
            expect(items[0].textContent).toContain('Customer contact');
            expect(items[0].classList.contains('flow-item')).toBe(true);
            expect(items[0].classList.contains('first')).toBe(true);
            expect(items[0].classList.contains('last')).toBe(false);
        });

        it('renders the second step correctly', () => {
            const items = root.shadowRoot!.querySelectorAll(
                'limel-progress-flow-item'
            );
            expect(items[1].textContent).toContain('Demand analysis');
            expect(items[1].classList.contains('first')).toBe(false);
            expect(items[1].classList.contains('last')).toBe(false);
        });

        it('renders the third step correctly', () => {
            const items = root.shadowRoot!.querySelectorAll(
                'limel-progress-flow-item'
            );
            expect(items[2].textContent).toContain('Agreement');
            expect(items[2].classList.contains('first')).toBe(false);
            expect(items[2].classList.contains('last')).toBe(true);
        });

        it('renders the passed step correctly', () => {
            const items = root.shadowRoot!.querySelectorAll(
                'limel-progress-flow-item'
            );
            expect(items[0].classList.contains('passed')).toBe(true);
            expect(items[0].classList.contains('selected')).toBe(false);
        });

        it('renders the selected step correctly', () => {
            const items = root.shadowRoot!.querySelectorAll(
                'limel-progress-flow-item'
            );
            expect(items[1].classList.contains('selected')).toBe(true);
            expect(items[1].classList.contains('passed')).toBe(false);
        });

        it('renders forthcoming step correctly', () => {
            const items = root.shadowRoot!.querySelectorAll(
                'limel-progress-flow-item'
            );
            expect(items[2].classList.contains('passed')).toBe(false);
            expect(items[2].classList.contains('selected')).toBe(false);
        });

        describe('when disabled', () => {
            it('sets the flow items to disabled', async () => {
                const result = await render(
                    <limel-progress-flow
                        flowItems={flowItems}
                        disabled={true}
                    ></limel-progress-flow>
                );
                await result.waitForChanges();

                const items = result.root.shadowRoot!.querySelectorAll(
                    'limel-progress-flow-item'
                );
                for (const item of items) {
                    expect((item as any).disabled).toBe(true);
                }
            });
        });

        describe('when readonly', () => {
            it('sets the flow items to disabled and readonly', async () => {
                const result = await render(
                    <limel-progress-flow
                        flowItems={flowItems}
                        readonly={true}
                    ></limel-progress-flow>
                );
                await result.waitForChanges();

                const items = result.root.shadowRoot!.querySelectorAll(
                    'limel-progress-flow-item'
                );
                for (const item of items) {
                    expect((item as any).disabled).toBe(true);
                    expect((item as any).readonly).toBe(true);
                }
            });
        });
    });

    describe('when the progress flow contains off progress steps', () => {
        it('renders the off progress steps correctly', async () => {
            const flowItems = [
                { text: 'Customer contact' },
                { text: 'Demand analysis', selected: true },
                { text: 'Agreement', isOffProgress: true },
                { text: 'Rejected', isOffProgress: true },
            ];

            const { root, waitForChanges } = await render(
                <limel-progress-flow
                    flowItems={flowItems}
                ></limel-progress-flow>
            );
            await waitForChanges();

            const offProgressItems =
                root.shadowRoot!.querySelectorAll('.off-progress-item');
            expect(offProgressItems.length).toEqual(2);

            expect(offProgressItems[0].textContent).toContain('Agreement');
            expect(
                offProgressItems[0].classList.contains(
                    'first-off-progress-item'
                )
            ).toBe(true);

            expect(offProgressItems[1].textContent).toContain('Rejected');
            expect(
                offProgressItems[1].classList.contains('last-off-progress-item')
            ).toBe(true);
        });
    });

    describe('when a flow item is clicked', () => {
        it('emits a change event when item was not already selected', async () => {
            const handleChange = vi.fn();
            const { root, waitForChanges } = await render(
                <limel-progress-flow
                    flowItems={[{ text: 'Customer contact' }]}
                    onChange={handleChange}
                ></limel-progress-flow>
            );
            await waitForChanges();

            const items = root.shadowRoot!.querySelectorAll(
                'limel-progress-flow-item'
            );
            // progress-flow-item uses shadow: false, so button is in light DOM
            const button = items[0].querySelector('button');
            button.click();
            await waitForChanges();

            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange.mock.calls[0][0].detail).toEqual({
                text: 'Customer contact',
            });
        });

        it('does not emit a change event when item was already selected', async () => {
            const handleChange = vi.fn();
            const { root, waitForChanges } = await render(
                <limel-progress-flow
                    flowItems={[{ text: 'Customer contact', selected: true }]}
                    onChange={handleChange}
                ></limel-progress-flow>
            );
            await waitForChanges();

            const items = root.shadowRoot!.querySelectorAll(
                'limel-progress-flow-item'
            );
            const button = items[0].querySelector('button');
            button.click();
            await waitForChanges();

            expect(handleChange).toHaveBeenCalledTimes(0);
        });
    });
});
