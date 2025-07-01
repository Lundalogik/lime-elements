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
        return <div class="limel-popover-surface" tabindex="0" />;
    }

    private appendElement() {
        const portalContainer = this.host.shadowRoot.querySelector(
            '.limel-popover-surface'
        );

        for (const child of this.contentCollection) {
            if (child.slot === 'trigger') {
                continue;
            }

            portalContainer.append(child);
        }
    }
}
