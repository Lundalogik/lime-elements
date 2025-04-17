import { Component, h, Prop, Host } from '@stencil/core';

/**
 * @exampleComponent limel-example-ai-avatar-basic
 */
@Component({
    tag: 'limel-ai-avatar',
    shadow: { delegatesFocus: true },
    styleUrl: 'ai-avatar.scss',
})
export class AIAvatar {
    @Prop({ reflect: true })
    public static: false;

    public render() {
        return (
            <Host>
                <div class="rings-container">
                    <div class="ring red" />
                    <div class="ring green" />
                    <div class="ring blue" />
                    <div class="ring yellow" />
                </div>
            </Host>
        );
    }
}
