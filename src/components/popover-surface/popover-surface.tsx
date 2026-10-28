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

    /**
     * The role of the surface, for assistive technology
     */
    @Prop()
    public popupRole?: string;

    /**
     * The name of the surface, for assistive technology
     */
    @Prop()
    public accessibleLabel?: string;

    @Element()
    private host: HTMLLimelPopoverSurfaceElement;

    public componentDidLoad() {
        this.appendElement();
    }

    public render() {
        return (
            <div
                class="limel-popover-surface"
                tabindex="0"
                role={this.popupRole}
                aria-label={this.accessibleLabel}
            />
        );
    }

    private appendElement() {
        const portalContainer = this.host.shadowRoot.querySelector(
            '.limel-popover-surface'
        );

        const childElementsCopy = [...this.contentCollection];
        for (const child of childElementsCopy) {
            if (child.slot === 'trigger') {
                continue;
            }

            portalContainer.append(child);
        }
    }
}
