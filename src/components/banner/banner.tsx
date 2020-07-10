import { Component, h, Method, Prop, State } from '@stencil/core';

/**
 * @slot buttons - Buttons to show in the banner
 */
@Component({
    tag: 'limel-banner',
    shadow: true,
    styleUrl: 'banner.scss',
})
export class Banner {
    /**
     * The text to show on the banner.
     */
    @Prop({ reflectToAttr: true })
    public message: string;

    /**
     * Set icon for the banner
     */
    @Prop({ reflectToAttr: true })
    public icon: string;

    @State()
    private isOpen = false;

    /**
     * Open the banner
     */
    @Method()
    public async open() {
        this.isOpen = true;
    }

    /**
     * Close the banner
     */
    @Method()
    public async close() {
        this.isOpen = false;
    }

    public render() {
        return (
            <div
                class={`lime-banner ${this.isOpen ? 'lime-banner--open' : ''}`}
            >
                <div class="lime-banner__surface">
                    <div class="lime-banner__content">
                        {this.renderIcon()}
                        <div class="mdc-typography--body2">{this.message}</div>
                        <div class="lime-banner__actions">
                            <slot name="buttons" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Render the icon for the button
     *
     * @returns {HTMLElement} the icon
     */
    private renderIcon() {
        if (!this.icon) {
            return;
        }

        return (
            <div class="lime-banner__icon">
                <limel-icon name={this.icon} badge={true} size="large" />
            </div>
        );
    }
}
