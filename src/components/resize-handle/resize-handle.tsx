import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Host,
    Prop,
} from '@stencil/core';
import { ARROW_LEFT, ARROW_RIGHT } from '../../util/keycodes';
import { dragToResize } from './drag-to-resize';

// The handle is on the left edge, so ArrowLeft makes the element wider, the
// same as dragging the handle to the left.
const KEYBOARD_WIDTH_CHANGES: Record<string, number> = {
    [ARROW_LEFT]: 16,
    [ARROW_RIGHT]: -16,
};

/**
 * A handle on the left edge of an element, which the user drags to resize the
 * element.
 *
 * @private
 */
@Component({
    tag: 'limel-resize-handle',
    shadow: true,
    styleUrl: 'resize-handle.scss',
})
export class ResizeHandle {
    /**
     * The accessible name of the handle.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * The width of the element, in pixels.
     */
    @Prop()
    public value?: number;

    /**
     * The smallest width that the element can have, in pixels.
     */
    @Prop()
    public min?: number;

    /**
     * The largest width that the element can have, in pixels.
     */
    @Prop()
    public max?: number;

    /**
     * Emitted when the user resizes the element. The detail is the width that
     * the user asks for, in pixels. The consumer limits it, uses it, and sets
     * the result as `value`.
     */
    @Event({ bubbles: false, composed: false })
    public changeSize: EventEmitter<number>;

    @Element()
    private host: HTMLElement;

    private stopResizing?: () => void;

    public connectedCallback() {
        this.stopResizing = dragToResize(
            this.host,
            this.elementWidth,
            (width) => this.changeSize.emit(width)
        );
    }

    public disconnectedCallback() {
        this.stopResizing?.();
        this.stopResizing = undefined;
    }

    public render() {
        return (
            <Host
                role="separator"
                aria-orientation="vertical"
                aria-label={this.label}
                aria-valuenow={this.value}
                aria-valuemin={this.min}
                aria-valuemax={this.max}
                tabindex="0"
                onKeyDown={this.handleKeyDown}
            >
                <div class="grip" role="presentation">
                    <span />
                    <span />
                    <span />
                </div>
            </Host>
        );
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        const change = KEYBOARD_WIDTH_CHANGES[event.key];
        if (change === undefined) {
            return;
        }

        event.preventDefault();
        this.changeSize.emit(this.elementWidth() + change);
    };

    // `offsetWidth` and not `getBoundingClientRect`, because an ancestor can
    // be scaled with a transform.
    private elementWidth = (): number => {
        return this.host.parentElement.offsetWidth;
    };
}
