import { Component, h, Host, State } from '@stencil/core';

/**
 * Changing Colors
 *
 * Using the provided CSS Properties, you can customize the colors of the
 * AI Avatar's rings to match your application's theme or personal preferences.
 *
 */
@Component({
    tag: 'limel-example-ai-avatar-color-props',
    shadow: true,
    styleUrl: 'ai-avatar-color-props.scss',
})
export class AiAvatarColorPropsExample {
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
