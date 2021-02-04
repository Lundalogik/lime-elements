import { Component, h, Prop, Element } from '@stencil/core';

/**
 * @slot - Content to put inside the surface
 * @private
 */

@Component({
    tag: 'limel-popover-surface',
    shadow: true,
    styleUrl: 'popover-surface.scss',
})
export class PopoverSurface {
    /**
     * True if the popover surface is open, false otherwise
     */
    @Prop()
    public open = false;

    /**
     * Content to render
     */
    @Prop()
    public contentCollection: HTMLCollection;

    @Element()
    private host: HTMLLimelPopoverSurfaceElement;

    public componentDidLoad() {
        this.appendElement();
    }

    public render() {
        const classList = {
            'limel-popover-surface': true,
            'limel-popover-surface--open': this.open,
        };

        return (
            <div class={classList} tabindex="-1">
                <slot name="body" />
            </div>
        );
    }

    private appendElement() {
        const portalSlot = this.host.shadowRoot.querySelector('slot');

        Array.from(this.contentCollection).forEach((child) => {
            portalSlot.appendChild(child);
        });
    }
}
