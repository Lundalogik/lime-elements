import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Host,
    Prop,
} from '@stencil/core';
import { dragToResize } from '../../util/drag-to-resize';
import {
    getKeyboardSizeChange,
    getOrientation,
    measureSize,
} from '../../util/resize-location';

/**
 * A handle on an edge of an element. The user drags the handle, or presses an
 * arrow key while the handle has focus, to resize the element.
 *
 * The handle does not resize the element. It emits `changeSize` with the size
 * that the user asks for, and the consumer applies it.
 *
 * The handle must be a direct child of the element that it resizes. When the
 * handle is placed directly in a shadow root, it resizes the element that has
 * the shadow root. It has `position: absolute` and `z-index: 1`, and sits on
 * the edge that `location` names. Give the element a `position` other than
 * `static`. If other content covers the handle, also give the element
 * `isolation: isolate`.
 *
 * @exampleComponent limel-example-resize-handle-basic
 * @exampleComponent limel-example-resize-handle-locations
 * @exampleComponent limel-example-resize-handle-grab-area
 * @private
 */
@Component({
    tag: 'limel-resize-handle',
    shadow: true,
    styleUrl: 'resize-handle.scss',
})
export class ResizeHandle {
    /**
     * The location of the handle relative to the resizable element.
     */
    @Prop({ reflect: true })
    public location: 'left' | 'right' | 'top' | 'bottom' = 'left';

    /**
     * The accessible name of the handle.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * The size of the element, in pixels: the width when `location` is `left`
     * or `right`, and the height when it is `top` or `bottom`.
     */
    @Prop()
    public value?: number;

    /**
     * The smallest size that the element can have, in pixels.
     */
    @Prop()
    public min?: number;

    /**
     * The largest size that the element can have, in pixels.
     */
    @Prop()
    public max?: number;

    /**
     * Emitted on each pointer move during a drag, and on each arrow key press.
     * The detail is the size that the user asks for, in pixels. The consumer
     * limits it, uses it, and sets the result as `value`.
     */
    @Event({ bubbles: false, composed: false })
    public changeSize: EventEmitter<number>;

    /**
     * Emitted after the last `changeSize` when the user has finished a resize:
     * when the pointer is released after it has moved, and after each arrow key
     * press. Pressing and releasing the handle without moving it emits nothing.
     */
    @Event({ bubbles: false, composed: false })
    public endResize: EventEmitter<void>;

    @Element()
    private host: HTMLElement;

    private stopResizing?: () => void;

    public connectedCallback() {
        this.stopResizing = dragToResize(this.host, {
            getLocation: () => this.location,
            getSize: this.elementSize,
            resize: (size) => this.changeSize.emit(size),
            end: () => this.endResize.emit(),
        });
    }

    public disconnectedCallback() {
        this.stopResizing?.();
        this.stopResizing = undefined;
    }

    public render() {
        return (
            <Host
                role="separator"
                aria-orientation={getOrientation(this.location)}
                aria-label={this.label}
                aria-valuenow={this.value}
                aria-valuemin={this.min}
                aria-valuemax={this.max}
                tabindex="0"
                onKeyDown={this.handleKeyDown}
            >
                <div role="presentation">
                    <span />
                    <span />
                    <span />
                </div>
            </Host>
        );
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        const change = getKeyboardSizeChange(this.location, event.key);
        if (change === undefined) {
            return;
        }

        event.preventDefault();
        this.changeSize.emit(this.elementSize() + change);
        this.endResize.emit();
    };

    private elementSize = (): number => {
        return measureSize(this.resizableElement(), this.location);
    };

    private resizableElement(): HTMLElement {
        if (this.host.parentElement) {
            return this.host.parentElement;
        }

        return (this.host.getRootNode() as ShadowRoot).host as HTMLElement;
    }
}
