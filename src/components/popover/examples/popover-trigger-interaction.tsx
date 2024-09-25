import { Component, h, State } from '@stencil/core';
const TRIGGER_DELAY = 1000;
/**
 * Trigger Interaction for Popovers
 *
 * Popovers are typically triggered by a click event, but they can also be triggered
 * by hover or focus events. This approach is especially useful when the click event
 * is reserved for other interactions, such as navigating to another page or activating
 * a different function.
 *
 * Triggering a popover with hover or focus is useful when clicking the trigger element
 * is required for actions like navigation, while still providing contextual information
 * or options through the popover.
 *
 * :::important
 * Key considerations when using hover and focus triggers:
 *
 * **Delayed Popover Opening**:
 * Hovering or focusing on the trigger element should not immediately open the popover.
 * Always introduce a reasonable delay before opening the popover to prevent accidental activation.
 * This prevents an annoying user experience where the popover opens as the user moves
 * their cursor across the UI. It's especially important in UIs with multiple trigger elements.
 *
 * **Popover Should Remain Open**:
 * The popover should remain open even if the user moves the cursor away from
 * the trigger element or navigates away with the keyboard.
 * This allows the user to interact with the popover content without it closing unexpectedly.
 *
 * **Touchscreen Accessibility**:
 * Consider the experience for users on touchscreen devices. Hover interactions might not be available,
 * so ensure the design is accessible to them.
 *
 * **Provide Proper Cues**:
 * Provide clear visual indicators, or use accessible attributes like `title` or `aria-label`,
 * to signal that the trigger element is interactive when hovered or focused.
 * This ensures that users understand they can interact with the element even without clicking.
 *
 * **Low discoverability**:
 * Remember that such interaction are not easily discovered by the end-users.
 * Therefore, you should avoid having any critical functionality to be hidden
 * behind such interactions, and only use it as supplementary means of enriching
 * the user experience.
 * :::
 */

@Component({
    tag: 'limel-example-popover-trigger-interaction',
    shadow: true,
    styleUrl: 'popover-trigger-interaction.scss',
})
export class PopoverTriggerInteractionExample {
    @State()
    private isOpen = false;

    private hoverTimeout: number;

    public render() {
        const chipImage = {
            src: 'https://lundalogik.github.io/lime-elements/0e6f74c0-11d9-465b-aac6-44f33da3cb7c.png',
            alt: 'A picture of Adrian Schmidt, Head of Smooth Operations at Lime Technologies',
        };

        const markdown = `
![Adrian Schmidt](https://lundalogik.github.io/lime-elements/0e6f74c0-11d9-465b-aac6-44f33da3cb7c.png)
### Adrian Schmidt
Head of
Smooth Operations

[Get in touch](https://github.com/adrianschmidt)
        `;

        return [
            <limel-popover
                open={this.isOpen}
                onClose={this.onPopoverClose}
                open-direction="top"
                style={{ '--popover-timeout': `${TRIGGER_DELAY}ms` }}
            >
                <div slot="trigger">
                    <limel-chip
                        text="Adrian Schmidt"
                        image={chipImage}
                        title="Hover or focus me!"
                        onMouseEnter={this.openPopoverWithDelay}
                        onMouseLeave={this.resetTimeout}
                        onFocus={this.openPopoverWithDelay}
                        onClick={this.handleClick}
                    />
                    {this.renderTimeoutFeedback()}
                </div>
                <limel-markdown
                    style={{
                        display: 'flex',
                        'flex-direction': 'column',
                        gap: '0.5rem',
                        padding: '0.5rem',
                    }}
                    tabIndex={0}
                    value={markdown}
                />
            </limel-popover>,
        ];
    }

    private renderTimeoutFeedback() {
        return <div class="opening-countdown-indicator" />;
    }

    private openPopoverWithDelay = (event: FocusEvent | MouseEvent) => {
        event.stopPropagation();
        console.log('opening popover with delay');

        clearTimeout(this.hoverTimeout);

        this.hoverTimeout = window.setTimeout(() => {
            this.isOpen = true;
        }, TRIGGER_DELAY);
    };

    private resetTimeout = () => {
        if (this.isOpen) {
            return;
        }

        console.log('resetting timeout');
        clearTimeout(this.hoverTimeout);
    };

    private onPopoverClose = (event: CustomEvent) => {
        event.stopPropagation();
        console.log('closing popover instantly');
        this.isOpen = false;
    };

    private handleClick = (event: MouseEvent) => {
        event.stopPropagation();
        console.log('chip is clicked, closing popover and opening alert');
        this.isOpen = false;

        alert('Popover closed, you clicked on the trigger!');
    };
}
