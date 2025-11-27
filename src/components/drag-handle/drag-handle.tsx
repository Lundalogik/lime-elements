import { Component, h, Host, Prop } from '@stencil/core';
import translate from '../../global/translations';
import { Languages } from '../date-picker/date.types';
import { OpenDirection } from '../menu/menu.types';

/**
 * This component resembles a drag handle button, but is implemented
 * as a `private` component to allow for easier styling and future extensions.
 *
 * :::important
 * This component has its `shadow` set to `false` in order to
 * integrate well with the drag-and-drop functionality, as well as
 * providing a better accessibility.
 *
 * Keep in mind that its styles might be affected by the consumer
 * component, due to its light dom.
 * :::
 *
 * :::tip
 * It's recommended to place the drag handle on the right side of
 * the item it is meant to reorder, to ensure consistent layout
 * design conventions.
 * :::
 *
 * @exampleComponent limel-example-drag-handle-basic
 * @exampleComponent limel-example-drag-handle-horizontal
 *
 * @private
 */
@Component({
    tag: 'limel-drag-handle',
    shadow: false,
    styleUrl: 'drag-handle.scss',
})
export class DragHandleComponent {
    /**
     * The direction in which the drag handle can be used to reorder items.
     * This affects both how the visual indicator is visualized,
     * and how what helper label is shown in the tooltip.
     */
    @Prop({ reflect: true })
    public dragDirection: 'vertical' | 'horizontal' = 'vertical';

    /**
     * The preferred direction for the tooltip to open.
     * Defaults to 'left', as our recommended placement for a drag handel
     * in the UI is on the far right side of draggable elements.
     */
    @Prop({ reflect: true })
    public tooltipOpenDirection: OpenDirection = 'left';

    /**
     * Language to use for translations.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    private readonly dragHandleId = 'drag-handle-' + crypto.randomUUID();

    public render() {
        const tooltipLabel = translate.get(
            'drag-handle.drag-to-reorder',
            this.language
        );
        const ariaLabel = translate.get(
            'drag-handle.drag-handle',
            this.language
        );

        return (
            <Host>
                <button
                    data-drag-handle
                    type="button"
                    class="limel-drag-handle"
                    tabindex={0}
                    aria-label={ariaLabel}
                    id={this.dragHandleId}
                    onClick={this.handleClick}
                >
                    <div
                        class="drag-icon"
                        role="presentation"
                        aria-hidden="true"
                    >
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} />
                        ))}
                    </div>
                    <limel-tooltip
                        openDirection={this.tooltipOpenDirection}
                        elementId={this.dragHandleId}
                        label={tooltipLabel}
                    />
                </button>
            </Host>
        );
    }

    private handleClick = (event: MouseEvent) => {
        // This prevents the click (from keyboard space/enter or pointer) from
        // reaching the parent item. The form template listens for clicks to
        // toggle collapsible sections and invoke move/reorder actions.
        // Without this, the synthetic click triggered by the keyboard would bubble,
        // causing duplicate behavior alongside the custom keyboard reordering event.
        event.preventDefault();
        event.stopPropagation();
    };
}
