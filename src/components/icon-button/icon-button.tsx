import { MDCRipple } from '@lime-material/ripple';
import { Component, Element, Prop } from '@stencil/core';

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
    private host: HTMLElement;

    private mdcIconButtonRipple;

    public componentDidLoad() {
        this.mdcIconButtonRipple = new MDCRipple(
            this.host.shadowRoot.querySelector('.mdc-icon-button')
        );
        this.mdcIconButtonRipple.unbounded = true;
    }

    public componentDidUnload() {
        this.mdcIconButtonRipple.destroy();
    }

    public render() {
        return (
            <button
                class={`mdc-icon-button`}
                disabled={this.disabled}
                aria-label={this.label}
            >
                <limel-icon name={this.icon} />
            </button>
        );
    }
}
