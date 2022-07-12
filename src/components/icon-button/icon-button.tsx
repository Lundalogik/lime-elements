import { Component, Element, h, Prop } from '@stencil/core';
import { IconSize } from '@limetech/lime-elements';

/**
 * @exampleComponent limel-example-icon-button-basic
 * @exampleComponent limel-example-icon-button-disabled
 * @exampleComponent limel-example-icon-button-elevated
 * @exampleComponent limel-example-icon-button-toggle-state
 * @exampleComponent limel-example-icon-button-composite
 */
@Component({
    tag: 'limel-icon-button',
    shadow: true,
    styleUrl: 'icon-button.scss',
})
export class IconButton {
    /**
     * The icon to display.
     */
    @Prop({ reflect: true })
    public icon: string;

    /**
     * Set to `true` to give the button our standard "elevated" look, lifting
     * it off the flat layout.
     */
    @Prop({ reflect: true })
    public elevated = false;

    /**
     * The text to show to screenreaders and other assistive tech.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Set to `true` to disable the button.
     */
    @Prop({ reflect: true })
    public disabled = false;

    @Element()
    private host: HTMLLimelIconButtonElement;

    public connectedCallback() {
        this.initialize();
    }

    public componentDidLoad() {
        this.initialize();
    }

    private initialize() {
        const element = this.host.shadowRoot.querySelector('.mdc-icon-button');
        if (!element) {
            return;
        }
    }

    public render() {
        const buttonAttributes: { tabindex?: string } = {};
        if (this.host.hasAttribute('tabindex')) {
            buttonAttributes.tabindex = this.host.getAttribute('tabindex');
        }

        const iconAttributes: { badge?: boolean; size?: IconSize } = {};
        if (this.elevated) {
            iconAttributes.badge = true;
            iconAttributes.size = 'small';
        }

        return (
            <button
                class="mdc-icon-button"
                disabled={this.disabled}
                aria-label={this.label}
                title={this.label}
                {...buttonAttributes}
            >
                <limel-icon name={this.icon} {...iconAttributes} />
            </button>
        );
    }
}
