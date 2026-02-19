import { render, h } from '@stencil/vitest';

describe('limel-snackbar', () => {
    describe('show', () => {
        it('opens the snackbar and displays the message', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-snackbar message="This is a message"></limel-snackbar>
            );
            await waitForChanges();

            setProps({ open: true });
            await waitForChanges();

            const popover = root.shadowRoot!.querySelector('[popover]');
            expect(popover.classList.contains('open')).toBe(true);

            const label = popover.querySelector('.label');
            expect(label.textContent).toEqual('This is a message');
        });
    });

    describe('with actionText', () => {
        it('opens the snackbar and displays the action button', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-snackbar
                    message="This is a message"
                    actionText="Press me!"
                ></limel-snackbar>
            );
            await waitForChanges();

            setProps({ open: true });
            await waitForChanges();

            const popover = root.shadowRoot!.querySelector('[popover]');

            const label = popover.querySelector('.label');
            expect(label.textContent).toEqual('This is a message');

            const button = root.shadowRoot!.querySelector('limel-button');
            expect(button.getAttribute('label')).toEqual('Press me!');
        });

        it('emits an action event when button is clicked', async () => {
            const handleAction = vi.fn();
            const { root, waitForChanges, setProps } = await render(
                <limel-snackbar
                    message="This is a message"
                    actionText="Press me!"
                    onAction={handleAction}
                ></limel-snackbar>
            );
            await waitForChanges();

            setProps({ open: true });
            await waitForChanges();

            const button = root.shadowRoot!.querySelector('limel-button');
            (button as any).click();
            await waitForChanges();

            expect(handleAction).toHaveBeenCalledTimes(1);
        });
    });
});
