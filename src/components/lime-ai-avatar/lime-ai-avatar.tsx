import { Component, h } from '@stencil/core';

/**
 * This component displays an avatar, representing Lime AI assistants.
 * :::warning
 * This is a private component used internally in the Lime's various applications,
 * which is the reason for having it in Lime Elements —to ease the distribution
 * of the component across all our apps.
 *
 * 3rd party developers are not allowed use this component directly.
 * :::
 *
 * @private
 * @exampleComponent limel-example-lime-ai-avatar-basic
 */
@Component({
    tag: 'limel-lime-ai-avatar',
    shadow: true,
    styleUrl: 'lime-ai-avatar.scss',
})
export class LimeAiAvatar {
    public render() {
        return [
            this.renderCircle('red'),
            this.renderCircle('green'),
            this.renderCircle('blue'),
            this.renderCircle('orange'),
        ];
    }

    private renderCircle(className: string) {
        return (
            <svg
                class={className}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="6"
                />
            </svg>
        );
    }
}
