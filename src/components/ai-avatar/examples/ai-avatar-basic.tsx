import { Component, h, Host, State } from '@stencil/core';

/**
 * Basic Example
 * The component will render a static avatar by default.
 * But you can trigger animations, based on user's interactions,
 * for example on `:hover`.
 *
 * This is easily done by toggling a custom CSS property:
 *
 * ```scss
 * limel-ai-avatar {
 *     &:hover {
 *         --ai-avatar-animation-play-state: running;
 *     }
 * }
 * ```
 *
 */
@Component({
    tag: 'limel-example-ai-avatar-basic',
    shadow: true,
    styleUrl: 'ai-avatar-basic.scss',
})
export class AiAvatarBasicExample {
    @State()
    private isThinking = false;

    public render() {
        return (
            <Host>
                <div class="avatar-container">
                    <limel-ai-avatar isThinking={this.isThinking} />
                </div>
                <limel-example-controls>
                    <limel-checkbox
                        checked={this.isThinking}
                        label="Is thinking"
                        onChange={this.setIsThinking}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private readonly setIsThinking = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.isThinking = event.detail;
    };
}
