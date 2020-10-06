import { MDCRipple } from '@limetech/mdc-ripple';
import { Component, Element, h, Method, Prop } from '@stencil/core';
import { IconSize } from '@limetech/lime-elements';

/**
 * @exampleComponent limel-example-icon-button
 * @exampleComponent limel-example-icon-button-toggle-state
 * @exampleComponent limel-example-icon-button-elevated
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
    @Prop({ reflectToAttr: true })
    public icon: string;

    /**
     * Set to `true` to give the button our standard "elevated" look, lifting
     * it off the flat layout.
     */
    @Prop({ reflectToAttr: true })
    public elevated = false;

    /**
     * The text to show to screenreaders and other assistive tech.
     */
    @Prop({ reflectToAttr: true })
    public label: string;

    /**
     * Set to `true` to disable the button.
     * Defaults to `false`.
     */
    @Prop({ reflectToAttr: true })
    public disabled = false;

    @Element()
    private host: HTMLLimelIconButtonElement;

    private mdcIconButtonRipple;

    /**
     * If the button is hidden or inside another element that is animating
     * while the button is instantiated, the hover-highlight may become
     * misaligned. If so, calling this method will make the button re-layout
     * the highlight.
     */
    @Method()
    public async relayout() {
        if (this.mdcIconButtonRipple) {
            this.mdcIconButtonRipple.layout();
        }
    }

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

        this.mdcIconButtonRipple = new MDCRipple(element);
        this.mdcIconButtonRipple.unbounded = true;
    }

    public disconnectedCallback() {
        this.mdcIconButtonRipple?.destroy();
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
