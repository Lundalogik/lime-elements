import { Component, Prop, h } from '@stencil/core';
import { Link } from '../../interface';

/**
 * This component can be used on places such as a start page or a dashboard.
 * Clicking on the component should navigate the user to a new screen,
 * to which you need to provide a URL, by specifying an `href` for the `link` property.
 *
 * By default, this navigation will happen within the same browser tab.
 * However, it is possible to override that behavior, by specifying a `target`
 * for the `link` property
 * @exampleComponent limel-example-shortcut
 * @exampleComponent limel-example-shortcut-notification
 * @exampleComponent limel-example-shortcut-styling
 * @exampleComponent limel-example-shortcut-with-click-handler
 */

@Component({
    tag: 'limel-shortcut',
    shadow: true,
    styleUrl: 'shortcut.scss',
})
export class Shortcut {
    /**
     * Name of icon for the shortcut.
     */
    @Prop({ reflect: true })
    public icon: string;

    /**
     * The text to show below the shortcut. Long label will be truncated.
     */
    @Prop({ reflect: true })
    public label?: string = null;

    /**
     * Set to `true` if shortcut is disabled.
     */
    @Prop({ reflect: true })
    public disabled?: boolean = false;

    /**
     * If specified, will display a notification badge
     * on the shortcut.
     */
    @Prop({ reflect: true })
    public badge?: number | string;

    /**
     * If supplied, the shortcut will be a clickable link.
     */
    @Prop()
    public link?: Link;

    public render() {
        return [
            <a
                aria-disabled={this.disabled}
                href={this.link?.href}
                target={this.link?.target}
                tabindex="0"
                aria-label={this.getAriaLabel()}
                title={this.link?.title}
            >
                <limel-icon name={this.icon} />
            </a>,
            this.renderLabel(),
            this.renderNotification(),
        ];
    }

    private renderLabel = () => {
        if (this.label) {
            return <span aria-hidden="true">{this.label}</span>;
        }
    };

    private getAriaLabel = () => {
        if (this.label && this.link?.title) {
            return this.label + '. ' + this.link.title;
        }

        if (this.label) {
            return this.label;
        }

        if (this.link?.title) {
            return this.link.title;
        }

        return undefined;
    };

    private renderNotification = () => {
        if (this.badge) {
            return <limel-badge label={this.badge} />;
        }
    };
}
