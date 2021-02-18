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
        return <div class="limel-popover-surface" tabindex="-1" />;
    }

    private appendElement() {
        const portalContainer = this.host.shadowRoot.querySelector(
            '.limel-popover-surface'
        );

        Array.from(this.contentCollection).forEach((child) => {
            portalContainer.appendChild(child);
        });
    }
}
