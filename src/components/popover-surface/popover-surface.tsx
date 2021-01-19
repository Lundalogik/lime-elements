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
     * Portal Id
     */
    @Prop()
    public portalId: string;

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
                <slot name="header" />
                <slot name="body" />
                <slot name="footer" />
            </div>
        );
    }

    private appendElement() {
        const portalSlots = this.host.shadowRoot.querySelectorAll('slot');
        Array.from(this.contentCollection).forEach((child) => {
            if (child instanceof HTMLElement) {
                const slot = child.getAttribute('slot');
                const element = Array.from(portalSlots).find(
                    (el) => el.name === slot
                );

                if (element) {
                    element.appendChild(child);
                }
            }
        });
    }
}
