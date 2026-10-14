import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Host,
    Listen,
    Prop,
    State,
} from '@stencil/core';
import { ESCAPE } from '../../util/keycodes';
import { createRandomString } from '../../util/random-string';

/**
 * Open panels, in the order they were connected. Only the last one handles
 * Escape.
 */
const openPanels: SidePanel[] = [];

interface WidthRange {
    now: number;
    min: number;
    max: number;
}

function stopEvent(event: Event) {
    event.stopPropagation();
}

/**
 * A resizable panel that is displayed on top of the right side of the page.
 * The content is placed in the default slot, below a toolbar with a close button.
 *
 * The panel is positioned relative to its nearest positioned ancestor. Set
 * `position: relative` on that element. Use `--side-panel-top-inset`,
 * `--side-panel-right-inset` and `--side-panel-bottom-inset` to keep parts of
 * that element visible, for example a header.
 *
 * The CSS custom properties can be set on the panel or on any ancestor.
 *
 * ## Closing
 *
 * The `close` event is emitted when the user clicks the close button, or presses
 * Escape anywhere on the page. The panel does not remove itself. The consumer
 * must remove it from the DOM.
 *
 * An Escape keydown event with `defaultPrevented` set does not emit `close`.
 * This lets a popover or dropdown inside the panel handle Escape without
 * closing the panel. `limel-dialog` does not prevent the event yet, so Escape in
 * a dialog inside the panel also closes the panel. The panel listens on `window`, so it receives the
 * event after all listeners on elements and on `document`.
 *
 * When more than one side panel is open, Escape closes only the panel that was
 * opened last.
 *
 * `close` and `changeWidth` events from the slotted content do not propagate
 * past the panel. This prevents a consumer from mistaking them for events
 * emitted by the panel.
 *
 * ## Width
 *
 * The panel starts with the width from `--side-panel-width`. The user can
 * resize the panel by dragging its left edge. The user can also use the
 * keyboard. When the handle has focus, ArrowLeft makes the panel wider and
 * ArrowRight makes it narrower.
 *
 * The panel keeps the new width itself. While the panel exists, this width wins
 * over `--side-panel-width`. The width is limited by `--side-panel-min-width`
 * and the available space.
 *
 * After each resize, the panel emits `changeWidth` with the new width in
 * pixels. The consumer does not have to handle the event. To keep the width
 * for the next time the panel opens, for example across sessions, store the
 * value. Then set it with `--side-panel-width` before the panel opens.
 *
 * @exampleComponent limel-example-side-panel-basic
 * @exampleComponent limel-example-side-panel-insets
 * @private
 */
@Component({
    tag: 'limel-side-panel',
    shadow: true,
    styleUrl: 'side-panel.scss',
})
export class SidePanel {
    /**
     * Label of the close button. Shown as a tooltip and used as the accessible
     * name.
     */
    @Prop()
    public closeLabel = 'Close';

    /**
     * Label of the resize handle. Used as the accessible name.
     */
    @Prop()
    public resizeLabel = 'Resize';

    /**
     * Emitted when the close button is clicked, or when Escape is pressed.
     */
    @Event()
    public close: EventEmitter<void>;

    /**
     * Emitted when the user has resized the panel. The detail is the new width
     * in pixels. The panel already uses the new width. Store the value to
     * restore the width with `--side-panel-width` the next time the panel opens.
     */
    @Event()
    public changeWidth: EventEmitter<number>;

    @Element()
    private host: HTMLElement;

    @State()
    private widthRange?: WidthRange;

    /**
     * The width that the user resized the panel to, in pixels.
     */
    @State()
    private userWidth?: number;

    private panel: HTMLElement;
    private body?: HTMLElement;
    private closeButtonId = createRandomString();
    private widthObserver?: ResizeObserver;

    public connectedCallback() {
        openPanels.push(this);
        window.addEventListener('keydown', this.handleKeyDown);
        this.observeWidth();
    }

    public disconnectedCallback() {
        this.stopObservingWidth();
        window.removeEventListener('keydown', this.handleKeyDown);
        this.removeFromOpenPanels();
    }

    public render() {
        return (
            <Host>
                <aside ref={this.setPanel} style={this.getPanelStyle()}>
                    {this.renderHandle()}
                    <div class="content">
                        <div class="toolbar">{this.renderCloseButton()}</div>
                        {this.renderBody()}
                    </div>
                </aside>
            </Host>
        );
    }

    // A native button and not `limel-icon-button`, because the hover animation
    // styles the icon, which is inside the shadow root of `limel-icon-button`.
    private renderCloseButton() {
        return (
            <button
                class="close"
                id={this.closeButtonId}
                aria-label={this.closeLabel}
                onClick={this.handleClickClose}
            >
                <limel-icon name="multiply" aria-hidden="true" />
                <limel-tooltip
                    elementId={this.closeButtonId}
                    label={this.closeLabel}
                />
            </button>
        );
    }

    private renderHandle() {
        return (
            <limel-resize-handle
                class="handle"
                label={this.resizeLabel}
                value={this.widthRange?.now}
                min={this.widthRange?.min}
                max={this.widthRange?.max}
                onChangeSize={this.handleChangeSize}
            />
        );
    }

    private renderBody() {
        return (
            <div class="body" ref={this.setBody}>
                <slot />
            </div>
        );
    }

    private setBody = (element?: HTMLElement) => {
        this.body = element;
        this.stopContentEventsInBody();
    };

    /**
     * Components in the content can emit events with the same names as the
     * panel's events, for example `close` from `limel-dialog` or
     * `limel-collapsible-section`. Events from slotted content pass through
     * `.body` before they reach the host, so they are stopped there. The panel's
     * own events are dispatched on the host, so they are not affected.
     *
     * Keep the event names in sync with {@link SidePanel.stopContentEventAtHost}.
     */
    private stopContentEventsInBody() {
        // Adding the same listener again has no effect, so re-renders are safe.
        this.body?.addEventListener('close', stopEvent);
        this.body?.addEventListener('changeWidth', stopEvent);
    }

    /**
     * Fallback for {@link SidePanel.stopContentEventsInBody}.
     * Stops `close` and `changeWidth` events that reach the host from any
     * element other than the host.
     *
     * This does not replace the slot listener. A consumer listener that is added
     * before the panel is connected runs before this one, and would still
     * receive the event.
     *
     * @param event - the event
     */
    @Listen('close')
    @Listen('changeWidth')
    protected stopContentEventAtHost(event: Event) {
        if (event.target === this.host) {
            return;
        }

        event.stopImmediatePropagation();
    }

    private setPanel = (element: HTMLElement) => {
        this.panel = element;
        this.observeWidth();
    };

    /**
     * Returns the width that the panel gets when it is set to `width`, after
     * `min-width` and `max-width` are applied.
     *
     * The limits use `min()`, `calc()` and custom properties, so they cannot be
     * read as numbers. Instead, the width is set temporarily and the result is
     * measured. `offsetWidth` forces a synchronous layout, and the
     * inline width is restored before the next paint, so nothing flickers.
     *
     * @param width - the requested width in pixels
     * @returns the clamped width in pixels
     */
    private clampWidth(width: number): number {
        const wasSet = this.panel.style.width;
        this.panel.style.width = `${width}px`;
        const clampedWidth = this.panel.offsetWidth;
        this.panel.style.width = wasSet;

        return clampedWidth;
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        if (
            event.key !== ESCAPE ||
            event.defaultPrevented ||
            !this.isLastOpened()
        ) {
            return;
        }

        event.preventDefault();
        this.close.emit();
    };

    private removeFromOpenPanels() {
        const index = openPanels.indexOf(this);
        if (index === -1) {
            return;
        }

        openPanels.splice(index, 1);
    }

    private isLastOpened(): boolean {
        return openPanels.at(-1) === this;
    }

    // An inline width wins over `--side-panel-width`, and is still limited by
    // `min-width` and `max-width`.
    private getPanelStyle(): Record<string, string> {
        if (this.userWidth === undefined) {
            return {};
        }

        return { width: `${this.userWidth}px` };
    }

    private resizeTo = (width: number) => {
        this.userWidth = this.clampWidth(width);
        this.changeWidth.emit(this.userWidth);
    };

    private handleChangeSize = (event: CustomEvent<number>) => {
        this.resizeTo(event.detail);
    };

    // A focusable separator must always have its values, and the width changes
    // when the consumer sets `--side-panel-width`, so the range is measured
    // after each layout change of the panel.
    private observeWidth() {
        this.stopObservingWidth();

        if (!this.panel) {
            return;
        }

        this.widthObserver = new ResizeObserver(this.updateWidthRange);
        this.widthObserver.observe(this.panel);
    }

    private stopObservingWidth() {
        this.widthObserver?.disconnect();
        this.widthObserver = undefined;
    }

    private updateWidthRange = () => {
        this.widthRange = this.measureWidthRange();
    };

    private measureWidthRange(): WidthRange {
        return {
            now: Math.round(this.currentWidth()),
            min: Math.round(this.clampWidth(0)),
            max: Math.round(this.clampWidth(Number.MAX_SAFE_INTEGER)),
        };
    }

    // `offsetWidth` and not `getBoundingClientRect`, because the opening
    // animation scales the panel with a transform.
    private currentWidth(): number {
        return this.panel.offsetWidth;
    }

    private handleClickClose = () => {
        this.close.emit();
    };
}
