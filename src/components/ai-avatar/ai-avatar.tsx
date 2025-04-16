import { Component, h, Host, Prop } from '@stencil/core';
import { Languages } from './../date-picker/date.types';
import translate from './../../global/translations';

/**
 * This component displays an avatar, representing Lime AI assistants.
 *
 * :::warning
 * This is a private component used internally in the Lime's various applications,
 * which is the reason for having it in Lime Elements —to ease the distribution
 * of the component across all our apps.
 *
 * 3rd party developers are not allowed use this component directly.
 * :::
 *
 * @private
 * @exampleComponent limel-example-ai-avatar-basic
 * @exampleComponent limel-example-ai-avatar-colors
 */
@Component({
    tag: 'limel-ai-avatar',
    shadow: true,
    styleUrl: 'ai-avatar.scss',
})
export class AiAvatar {
    /**
     * Set to `true` to trigger animations that indicate that the AI is
     * "thinking" or processing something.
     */
    @Prop({ reflect: true })
    public isThinking = false;

    /**
     * Defines the language for translations.
     */
    @Prop({ reflect: true })
    public language: Languages = document.documentElement.lang as Languages;

    public render() {
        return (
            <Host role="img" aria-label={this.getHostAriaLabel()}>
                {this.renderCircle('red')}
                {this.renderCircle('green')}
                {this.renderCircle('blue')}
                {this.renderCircle('orange')}
                <div class="core" />
                <div class="orbitals" />
            </Host>
        );
    }

    private getHostAriaLabel(): string {
        let thinkingText = '';
        if (this.isThinking) {
            thinkingText = ` (${this.getTranslation('ai-avatar.thinking')})`;
        }

        return `${this.getTranslation('ai-avatar.label')}${thinkingText}`;
    }

    private renderCircle(className: string) {
        return (
            <svg
                class={className}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                role="presentation"
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

    private getTranslation = (key: string) => {
        return translate.get(key, this.language);
    };
}
