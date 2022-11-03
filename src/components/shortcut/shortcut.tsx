import { Component, Prop, h } from '@stencil/core';

/**
 * This component can be used on places such as a start page or a dashboard.
 * Clicking on the component should navigate the user to a new screen,
 * to which you need to provide a URL, using the `href` property.
 *
 * By default, this navigation will happen within the same browser tab.
 * However, it is possible to override that behavior, using the `target` property.
 *
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
     * The `title` tag of the hyperlink, which can be used to
     * provide additional information about the link.
     * It improves accessibility both for sighted users
     * and users with assistive technologies.
     */
    @Prop({ reflect: true })
    public linkTitle?: string = null;

    /**
     * Set to `true` if shortcut is disabled.
     */
    @Prop({ reflect: true })
    public disabled?: boolean = false;

    /**
     * The url that the shortcut leads to.
     */
    @Prop({ reflect: true })
    public href?: string = null;

    /**
     * Where to load the linked URL, as the name for a browsing context:
     * - `_self`: in the current browsing context. (Default)
     * - `_blank`: in a new tab.
     * - `_parent`: in the parent browsing context of the current one.
     * If no parent, behaves as `_self`.
     * - `_top`: the topmost browsing context (the "highest" context
     * that's an ancestor of the current one). If no ancestors, behaves as `_self`.
     */
    @Prop({ reflect: true })
    public target: '_self' | '_blank' | '_parent' | '_top' = '_self';

    /**
     * If specified, will display a notification badge
     * on the shortcut.
     */
    @Prop({ reflect: true })
    public badge?: number | string;

    public render() {
        return [
            <a
                aria-disabled={this.disabled}
                href={this.href}
                target={this.target}
                tabindex="0"
                aria-label={this.getAriaLabel()}
                title={this.linkTitle}
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
        if (this.label && this.linkTitle) {
            return this.label + '. ' + this.linkTitle;
        }

        if (this.label) {
            return this.label;
        }

        if (this.linkTitle) {
            return this.linkTitle;
        }

        return undefined;
    };

    private renderNotification = () => {
        if (this.badge) {
            return <limel-badge label={this.badge} />;
        }
    };
}
