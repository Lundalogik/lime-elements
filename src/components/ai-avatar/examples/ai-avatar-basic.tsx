import { Component, h, Host } from '@stencil/core';

/**
 * Basic Example
 * The component renders in `idle` mode by default.
 * The avatar's default mode features decorative stars
 * which are these days recognized as a symbol of "Artificial Intelligence".
 *
 * Set the `mode` property to drive the avatar into
 * one of its active states.
 */
@Component({
    tag: 'limel-example-ai-avatar-basic',
    shadow: true,
    styleUrl: 'ai-avatar-basic.scss',
})
export class AiAvatarBasicExample {
    public render() {
        return (
            <Host>
                <div class="avatar-container">
                    <limel-ai-avatar />
                </div>
            </Host>
        );
    }
}
