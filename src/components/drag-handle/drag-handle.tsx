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
     */
    @Prop({ reflect: true })
    public dragDirection: 'vertical' | 'horizontal' = 'vertical';

    /**
     * The preferred direction for the tooltip to open.
     * Defaults to 'left', as our recommended placement for a drag handle
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
                    tabindex={-1}
                    aria-label={ariaLabel}
                    id={this.dragHandleId}
                    onClick={this.handleClick}
                >
                    <div
                        class="drag-icon"
                        role="presentation"
                        aria-hidden="true"
                    >
                        <div key="1" />
                        <div key="2" />
                        <div key="3" />
                        <div key="4" />
                        <div key="5" />
                        <div key="6" />
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

    private readonly handleClick = (event: MouseEvent) => {
        // Prevent bubbling so the parent item does not treat the pointer click as
        // a toggle or reorder action.
        event.preventDefault();
        event.stopPropagation();
    };
}
