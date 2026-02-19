import { render, h } from '@stencil/vitest';

describe('limel-progress-flow-item', () => {
    it('renders an empty component', async () => {
        const { root, waitForChanges } = await render(
            <limel-progress-flow-item></limel-progress-flow-item>
        );
        await waitForChanges();
        expect(root).toBeTruthy();
    });

    describe('basic item', () => {
        it('renders the item with correct text', async () => {
            const { root, waitForChanges } = await render(
                <limel-progress-flow-item
                    item={{ text: 'Customer contact' }}
                ></limel-progress-flow-item>
            );
            await waitForChanges();

            const button = root.querySelector('button')!;
            expect(button).toBeTruthy();
            expect(button.textContent).toContain('Customer contact');
            expect(button.getAttribute('title')).toEqual('Customer contact');
        });
    });

    describe('when the item is clicked', () => {
        it('emits an interact event', async () => {
            const handleInteract = vi.fn();
            const { root, waitForChanges } = await render(
                <limel-progress-flow-item
                    item={{ text: 'Customer contact' }}
                    onInteract={handleInteract}
                ></limel-progress-flow-item>
            );
            await waitForChanges();

            const button = root.querySelector('button')!;
            button.click();
            await waitForChanges();

            expect(handleInteract).toHaveBeenCalledTimes(1);
        });
    });

    describe('when secondary text is given', () => {
        it('adds the secondary text to the title of the button', async () => {
            const { root, waitForChanges } = await render(
                <limel-progress-flow-item
                    item={{
                        text: 'Customer contact',
                        secondaryText: 'Via phone support',
                    }}
                ></limel-progress-flow-item>
            );
            await waitForChanges();

            const button = root.querySelector('button')!;
            expect(button.title).toEqual(
                'Customer contact · Via phone support'
            );
        });

        it('renders the secondary text', async () => {
            const { root, waitForChanges } = await render(
                <limel-progress-flow-item
                    item={{
                        text: 'Customer contact',
                        secondaryText: 'Via phone support',
                    }}
                ></limel-progress-flow-item>
            );
            await waitForChanges();

            const secondaryText = root.querySelector('.secondary-text')!;
            expect(secondaryText.textContent).toContain('Via phone support');
        });
    });

    describe('when icon is given', () => {
        it('renders the item with the icon', async () => {
            const { root, waitForChanges } = await render(
                <limel-progress-flow-item
                    item={{ text: 'Customer contact', icon: 'unit-test' }}
                ></limel-progress-flow-item>
            );
            await waitForChanges();

            const icon = root.querySelector('limel-icon')!;
            expect(icon).toBeTruthy();
            expect(icon.getAttribute('name')).toEqual('unit-test');
        });
    });

    describe('when the flow item is selected', () => {
        it('has selected class on the button', async () => {
            const { root, waitForChanges } = await render(
                <limel-progress-flow-item
                    item={{ text: 'Customer contact', selected: true }}
                ></limel-progress-flow-item>
            );
            await waitForChanges();

            const button = root.querySelector('button')!;
            expect(button.classList.contains('selected')).toBe(true);
        });
    });

    describe('when the flow item is disabled', () => {
        it('has disabled attribute and class on the button', async () => {
            const { root, waitForChanges } = await render(
                <limel-progress-flow-item
                    item={{ text: 'Customer contact', disabled: true }}
                ></limel-progress-flow-item>
            );
            await waitForChanges();

            const button = root.querySelector('button')!;
            expect(button.hasAttribute('disabled')).toBe(true);
            expect(button.classList.contains('disabled')).toBe(true);
        });
    });

    describe('when readonly is true', () => {
        it('has readonly and disabled classes on the button', async () => {
            const { root, waitForChanges } = await render(
                <limel-progress-flow-item
                    item={{ text: 'Customer contact' }}
                    readonly={true}
                ></limel-progress-flow-item>
            );
            await waitForChanges();

            const button = root.querySelector('button')!;
            expect(button.classList.contains('readonly')).toBe(true);
            expect(button.classList.contains('disabled')).toBe(true);
            expect(button.hasAttribute('disabled')).toBe(true);
        });
    });
});
