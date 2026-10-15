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
import { getDeepActiveElement } from '../../util/get-deep-active-element';
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
 * The panel is a dialog that does not block the rest of the page. Set `label`
 * to give it an accessible name, which screen readers announce. When the panel
 * opens, focus moves into it. When the panel is removed, focus returns to the
 * element that had it before, unless focus is somewhere else by then.
 *
 * The panel emits `close` when the user clicks the close button, or presses
 * Escape. It does not remove itself. The consumer must remove it from the DOM.
 * The user can resize the panel by dragging its left edge, or with the arrow
 * keys. The panel emits `changeWidth` when a resize is finished.
 *
 * See the examples for how closing and resizing work in detail.
 *
 * @exampleComponent limel-example-side-panel-basic
 * @exampleComponent limel-example-side-panel-insets
 * @exampleComponent limel-example-side-panel-escape
 * @private
 */
@Component({
    tag: 'limel-side-panel',
    shadow: true,
    styleUrl: 'side-panel.scss',
})
export class SidePanel {
    /**
     * Accessible name of the panel. Screen readers announce it. Set it to
     * something that tells the user what the panel is for.
     */
    @Prop()
    public label?: string;

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
     * Whether pressing Escape emits `close`. Set to `false` to let only the
     * close button emit `close`. The panel then does not prevent the Escape
     * event either.
     */
    @Prop()
    public closeOnEscape = true;

    /**
     * Emitted when the close button is clicked, or when Escape is pressed and
     * `closeOnEscape` is `true`.
     */
    @Event()
    public close: EventEmitter<void>;

    /**
     * Emitted when the user has finished a resize that changed the width. The
     * detail is the new width in pixels. The panel already uses the new width. Store the value to
     * restore the width with `--side-panel-width` the next time the panel opens.
     */
    @Event()
    public changeWidth: EventEmitter<number>;

    @Element()
    private host: HTMLElement;

    @State()
    private widthRange?: WidthRange;

    private panel: HTMLElement;
    private minLimit?: HTMLElement;
    private maxLimit?: HTMLElement;
    private body?: HTMLElement;
    private closeButtonId = createRandomString();
    private widthObserver?: ResizeObserver;

    /**
     * The width before the resize that is in progress, in pixels. `undefined`
     * when the user is not resizing the panel.
     */
    private widthBeforeResize?: number;

    /**
     * The element that had focus when the panel was added to the page.
     */
    private focusedBefore?: Element;

    public connectedCallback() {
        openPanels.push(this);
        window.addEventListener('keydown', this.handleKeyDown);
        this.rememberFocusedElement();
        this.observeWidth();
    }

    public componentDidLoad() {
        this.observeWidth();
        this.moveFocusIntoPanel();
    }

    public disconnectedCallback() {
        this.widthBeforeResize = undefined;
        this.stopObservingWidth();
        window.removeEventListener('keydown', this.handleKeyDown);
        this.removeFromOpenPanels();
        queueMicrotask(this.restoreFocus);
    }

    public render() {
        return (
            <Host>
                <section
                    ref={this.setPanel}
                    role="dialog"
                    aria-label={this.label}
                    tabindex="-1"
                >
                    {this.renderHandle()}
                    <div class="content">
                        <div class="toolbar">{this.renderCloseButton()}</div>
                        {this.renderBody()}
                    </div>
                </section>
                <span data-limit="min" ref={this.setMinLimit} />
                <span data-limit="max" ref={this.setMaxLimit} />
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
                onEndResize={this.handleEndResize}
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

    private moveFocusIntoPanel() {
        this.panel.focus({ preventScroll: true });
    }

    private rememberFocusedElement() {
        const element = getDeepActiveElement();
        if (!element || element === document.body) {
            return;
        }

        this.focusedBefore = element;
    }

    // Moving the panel in the DOM also disconnects it. It is then connected
    // again before the microtask runs. Focus only returns when it was lost with
    // the panel, and not when the user has moved it to another element.
    private restoreFocus = () => {
        const hasLostFocus =
            !document.activeElement || document.activeElement === document.body;
        if (this.host.isConnected || !hasLostFocus) {
            return;
        }

        const element = this.focusedBefore;
        this.focusedBefore = undefined;
        if (element?.isConnected) {
            (element as HTMLElement).focus();
        }
    };

    private setPanel = (element: HTMLElement) => {
        this.panel = element;
    };

    private setMinLimit = (element?: HTMLElement) => {
        this.minLimit = element;
    };

    private setMaxLimit = (element?: HTMLElement) => {
        this.maxLimit = element;
    };

    private handleKeyDown = (event: KeyboardEvent) => {
        if (
            !this.closeOnEscape ||
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
    // `min-width` and `max-width`. The width is set on the element and not with
    // a state, because a render and a measurement on each pointer move make
    // the drag slow when the content is large.
    private setWidth(width: number) {
        this.panel.style.width = `${width}px`;
    }

    private handleChangeSize = (event: CustomEvent<number>) => {
        this.rememberWidthBeforeResize();
        this.setWidth(event.detail);
    };

    private handleEndResize = () => {
        if (!this.isResizing()) {
            return;
        }

        const widthBefore = this.widthBeforeResize;
        this.widthBeforeResize = undefined;
        this.keepClampedWidth();
        this.updateWidthRange();
        this.emitWidthIfChanged(widthBefore);
    };

    private rememberWidthBeforeResize() {
        if (this.isResizing()) {
            return;
        }

        this.widthBeforeResize = this.currentWidth();
    }

    private isResizing(): boolean {
        return this.widthBeforeResize !== undefined;
    }

    // A drag past a limit sets a width that CSS clamps. Without the clamped
    // width, the panel grows when its container grows.
    private keepClampedWidth() {
        this.setWidth(this.currentWidth());
    }

    private emitWidthIfChanged(widthBefore: number) {
        const width = this.currentWidth();
        if (width === widthBefore) {
            return;
        }

        this.changeWidth.emit(width);
    }

    // A focusable separator must always have its values. The width changes when
    // the consumer sets `--side-panel-width`, and the limits change with the
    // width of the positioned ancestor, so the range is measured when the panel
    // or an element for the limits changes size.
    private observeWidth() {
        this.stopObservingWidth();

        if (!this.panel) {
            return;
        }

        this.widthObserver = new ResizeObserver(this.handleSizeChange);
        for (const element of [this.panel, this.minLimit, this.maxLimit]) {
            if (element) {
                this.widthObserver.observe(element);
            }
        }
    }

    private stopObservingWidth() {
        this.widthObserver?.disconnect();
        this.widthObserver = undefined;
    }

    // The height of the panel, and a width that `updateWidthRange` has already
    // measured, for example after an arrow key press, need no new measurement.
    private handleSizeChange = (entries: ResizeObserverEntry[]) => {
        if (entries.every(this.isMeasured)) {
            return;
        }

        this.updateWidthRange();
    };

    private isMeasured = (entry: ResizeObserverEntry): boolean => {
        return (
            entry.target === this.panel &&
            Math.round(entry.borderBoxSize[0].inlineSize) ===
                this.widthRange?.now
        );
    };

    // Reading the current width forces a layout of the content, which is slow
    // when the content is large. The range does not change during a resize, so it
    // is measured when the resize ends.
    private updateWidthRange = () => {
        if (this.isResizing()) {
            return;
        }

        this.widthRange = this.measureWidthRange();
    };

    private measureWidthRange(): WidthRange {
        const min = this.minLimit.offsetWidth;
        const max = Math.max(min, this.maxLimit.offsetWidth);

        return {
            now: Math.round(this.currentWidth()),
            min: Math.round(min),
            max: Math.round(max),
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
