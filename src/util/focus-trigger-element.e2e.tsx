import { render, h } from '@stencil/vitest';
import { focusTriggerElement } from './focus-trigger-element';

function getFocusedElement(): Element | null {
    let element = document.activeElement;
    while (element?.shadowRoot?.activeElement) {
        element = element.shadowRoot.activeElement;
    }

    return element;
}

describe('focusTriggerElement()', () => {
    it('focuses a trigger that can take focus itself', async () => {
        const { root, waitForChanges } = await render(
            <button type="button">Open</button>
        );
        await waitForChanges();

        expect(focusTriggerElement(root)).toBe(true);
        expect(getFocusedElement()).toBe(root);
    });

    it('focuses the button inside a component that passes the focus on', async () => {
        const { root, waitForChanges } = await render(
            <limel-button label="Open" />
        );
        await waitForChanges();

        expect(focusTriggerElement(root)).toBe(true);
        expect(getFocusedElement()).toBe(
            root.shadowRoot!.querySelector('button')
        );
    });

    it('focuses a control inside a trigger that can not take focus itself', async () => {
        const { root, waitForChanges } = await render(
            <div>
                <span>Text</span>
                <button type="button">Open</button>
            </div>
        );
        await waitForChanges();

        expect(focusTriggerElement(root)).toBe(true);
        expect(getFocusedElement()).toBe(root.querySelector('button'));
    });

    it('focuses an enabled control after a disabled one', async () => {
        const { root, waitForChanges } = await render(
            <div>
                <button type="button" disabled>
                    Off
                </button>
                <button type="button" id="enabled">
                    On
                </button>
            </div>
        );
        await waitForChanges();

        focusTriggerElement(root);

        expect(getFocusedElement()).toBe(root.querySelector('#enabled'));
    });

    it('focuses a button in a component that is inside the shadow root of the trigger', async () => {
        const { root, waitForChanges } = await render(<div />);
        const trigger = document.createElement('div');
        trigger.attachShadow({ mode: 'open' }).innerHTML =
            '<p><limel-button label="Open"></limel-button></p>';
        root.append(trigger);
        await waitForChanges();
        const innerButton = trigger.shadowRoot!.querySelector('limel-button')!;
        await innerButton.componentOnReady();

        focusTriggerElement(trigger);

        expect(getFocusedElement()).toBe(
            innerButton.shadowRoot!.querySelector('button')
        );
    });

    it('focuses a trigger that can take focus itself, not the controls inside it', async () => {
        const { root, waitForChanges } = await render(<div />);
        const trigger = document.createElement('div');
        trigger.tabIndex = 0;
        trigger.attachShadow({ mode: 'open' }).innerHTML =
            '<button type="button">Inside</button>';
        root.append(trigger);
        await waitForChanges();

        focusTriggerElement(trigger);

        expect(getFocusedElement()).toBe(trigger);
    });

    it('does not focus a trigger that is marked as disabled', async () => {
        const { root, waitForChanges } = await render(
            <button type="button" aria-disabled="true">
                Open
            </button>
        );
        await waitForChanges();

        expect(focusTriggerElement(root)).toBe(false);
        expect(getFocusedElement()).not.toBe(root);
    });

    it('does nothing without a trigger', () => {
        expect(focusTriggerElement(undefined)).toBe(false);
    });
});
