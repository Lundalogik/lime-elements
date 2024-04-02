import { Component, h, Method, Prop, State } from '@stencil/core';
import { getIconName } from '../icon/get-icon-props';
import { Icon } from 'src/global/shared-types/icon.types';

/**
 * @exampleComponent limel-example-banner
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
    @Prop({ reflect: true })
    public message: string;

    /**
     * Set icon for the banner
     */
    @Prop({ reflect: true })
    public icon: Icon | string;

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
                        <div>{this.message}</div>
                        <div class="lime-banner__actions">
                            <slot name="buttons" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private renderIcon(): HTMLElement {
        if (!this.icon) {
            return;
        }

        const name = getIconName(this.icon);

        return (
            <div class="lime-banner__icon">
                <limel-icon name={name} badge={true} size="large" />
            </div>
        );
    }
}
