import { Component, h, Host, State } from '@stencil/core';

/**
 * With background colors
 * To render better, the AI avatar needs to be placed on a colored background.
 */
@Component({
    tag: 'limel-example-ai-avatar-colors',
    shadow: true,
    styleUrl: 'ai-avatar-basic.scss',
})
export class AiAvatarColorsExample {
    @State()
    private isThinking = false;

    @State()
    private backgroundColor = 'rgb(var(--color-blue-default))';

    public render() {
        return (
            <Host>
                <div class="avatar-container">
                    <limel-ai-avatar
                        style={{
                            backgroundColor: this.backgroundColor,
                            borderRadius: '50%',
                        }}
                        isThinking={this.isThinking}
                    />
                </div>
                <limel-example-controls>
                    <limel-checkbox
                        checked={this.isThinking}
                        label="Is thinking"
                        onChange={this.setIsThinking}
                    />
                    <limel-color-picker-palette
                        label="Background Color"
                        helperText="Select a background color for the AI avatar"
                        value={this.backgroundColor}
                        onChange={this.handleColorChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private readonly handleColorChange = (event: CustomEvent<string>) => {
        this.backgroundColor = event.detail;
    };

    private readonly setIsThinking = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.isThinking = event.detail;
    };
}
