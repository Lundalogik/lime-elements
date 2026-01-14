import { Component, h, Host, State } from '@stencil/core';

/**
 * Light Background
 *
 * The avatar renders decently on darker colors, since its visual details use a
 * `mix-blend-mode` to blend in both with the background and with each other,
 * yet render some visible contrast.
 *
 * However, when the AI avatar is placed on a white or light background,
 * the default blend modes (`plus-lighter` and `screen`) can make
 * the avatar nearly invisible.
 *
 * This example demonstrates how to override the blend modes using
 * custom CSS properties to ensure proper visibility:
 *
 * - `--ai-avatar-core-blend-mode: hard-light`
 * - `--ai-avatar-rings-blend-mode: darken`
 */
@Component({
    tag: 'limel-example-ai-avatar-white-background',
    shadow: true,
    styleUrl: 'ai-avatar-white-background.scss',
})
export class AiAvatarWhiteBackgroundExample {
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
