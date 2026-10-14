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
import {
    getIconBackgroundColor,
    getIconColor,
    getIconName,
} from '../icon/get-icon-props';
import { Icon, IconName } from '../../global/shared-types/icon.types';
import {
    SidePanelAction,
    SidePanelActionSelect,
    SidePanelActionType,
    SidePanelEntry,
} from './side-panel.types';

/**
 * Open panels, in the order they were connected. Only the last one handles
 * Escape.
 */
const openPanels: SidePanel[] = [];

// The same icons as the navigation buttons in the Lime CRM web client.
const ACTION_ICONS: Record<SidePanelActionType, string> = {
    newTab: 'up_right_arrow',
    expand: 'expand',
};

interface WidthRange {
    now: number;
    min: number;
    max: number;
}

function getLinkTarget(action: SidePanelAction): string | undefined {
    if (action.href && action.type === 'newTab') {
        return '_blank';
    }
}

function stopEvent(event: Event) {
    event.stopPropagation();
}

/**
 * A resizable panel that is displayed on top of the right side of the page.
 * The content is placed in the default slot, below a toolbar and a header.
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
 * ## Header
 *
 * The header shows the heading, subheading and icon of the last entry in
 * `stack`. When the entry has a `color`, the header gets that background color,
 * and the headings are white with a text shadow. When `stack` is empty, the
 * panel has no header.
 *
 * Put controls for the header, for example a follow button or a menu, in the
 * `header-actions` slot. They are shown at the right end of the header. When
 * `stack` is empty, there is no header, and the slot content is not shown.
 *
 * The slot is for small controls. It is at most half as wide as the header,
 * and at most as tall as the heading and subheading together. Larger content
 * is cut off, so that the header keeps its size.
 *
 * The slot content is not tied to an entry in `stack`. When the last entry
 * changes, the consumer must also change the slot content.
 *
 * The slot content keeps its own colors. Use `--side-panel-header-text-color`
 * to match the text color of the header. It is white when the header has a
 * `color`. It can also be used as the `color` of an `Icon`.
 *
 * ## Actions
 *
 * The toolbar has a close button on the left. Other buttons are set with
 * `actions`, and are shown on the right. The `type` of an action decides its
 * icon. When the user clicks an action, the panel emits `selectAction` with the
 * `id` of the action and the click event. The consumer decides what the action
 * does.
 *
 * An action with an `href` is a link, so the user can open it in a new tab.
 * To handle the navigation in another way, for example with the router of the
 * application, call `preventDefault` on the click event in `selectAction`. Do
 * this only for a plain click with the primary button. Let the browser handle
 * all other clicks, so that Ctrl-click and Cmd-click still open the link in a
 * new tab:
 *
 * ```ts
 * function handleSelectAction(event: CustomEvent<SidePanelActionSelect>) {
 *     const click = event.detail.event;
 *     const isPlainClick =
 *         click.button === 0 &&
 *         !click.metaKey &&
 *         !click.ctrlKey &&
 *         !click.shiftKey &&
 *         !click.altKey;
 *     if (!isPlainClick) {
 *         return;
 *     }
 *
 *     click.preventDefault();
 *     router.navigate(event.detail.id);
 * }
 * ```
 *
 * @exampleComponent limel-example-side-panel-basic
 * @exampleComponent limel-example-side-panel-insets
 * @exampleComponent limel-example-side-panel-escape
 * @exampleComponent limel-example-side-panel-actions
 * @exampleComponent limel-example-side-panel-header-actions
 * @slot - Content of the panel
 * @slot header-actions - Small controls at the right end of the header. Content that is larger than half the header width or the height of the headings is cut off.
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
     * The panels in the stack, outermost first. The last entry is the panel
     * that is displayed. Its heading, subheading and icon are shown in the
     * header.
     */
    @Prop()
    public stack: SidePanelEntry[] = [];

    /**
     * Buttons in the toolbar, to the right of the close button.
     */
    @Prop()
    public actions: SidePanelAction[] = [];

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
     * Emitted when an action in the toolbar is clicked. The detail has the `id`
     * of the action, or its `type` if it has no `id`, and the click event.
     */
    @Event()
    public selectAction: EventEmitter<SidePanelActionSelect>;

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
    private closeButtonId = createRandomString();
    private actionIdPrefix = createRandomString();
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
                        <div class="toolbar">
                            {this.renderCloseButton()}
                            {this.renderActions()}
                        </div>
                        {this.renderHeader()}
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

    private renderActions() {
        if (this.actions.length === 0) {
            return;
        }

        return (
            <div class="actions">
                {this.actions.map((action, index) =>
                    this.renderAction(action, index)
                )}
            </div>
        );
    }

    private renderAction = (action: SidePanelAction, index: number) => {
        const id = `${this.actionIdPrefix}-${index}`;
        const Tag = action.href ? 'a' : 'button';

        return (
            <Tag
                class={action.type}
                id={id}
                href={action.href}
                target={getLinkTarget(action)}
                aria-label={action.label}
                onClick={this.handleClickAction(action)}
            >
                <limel-icon
                    name={ACTION_ICONS[action.type]}
                    aria-hidden="true"
                />
                <limel-tooltip
                    elementId={id}
                    label={action.label}
                    helperLabel={action.helperLabel}
                />
            </Tag>
        );
    };

    private renderHeader() {
        const entry = this.stack.at(-1);
        if (!entry) {
            return;
        }

        return (
            <div
                class={{ header: true, 'has-color': !!entry.color }}
                style={{ 'background-color': entry.color }}
            >
                {this.renderHeaderIcon(entry.icon)}
                <div class="headings">
                    <h1 class="heading">{entry.heading}</h1>
                    {this.renderSubheading(entry.subheading)}
                </div>
                <div class="header-actions" ref={this.stopContentEvents}>
                    <slot name="header-actions" />
                </div>
            </div>
        );
    }

    private renderHeaderIcon(icon?: IconName | Icon) {
        const name = getIconName(icon);
        if (!name) {
            return;
        }

        return (
            <limel-icon
                name={name}
                style={{
                    color: getIconColor(icon),
                    'background-color': getIconBackgroundColor(icon),
                }}
            />
        );
    }

    private renderSubheading(subheading?: string) {
        if (!subheading) {
            return;
        }

        return <h2 class="subheading">{subheading}</h2>;
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
            <div class="body" ref={this.stopContentEvents}>
                <slot />
            </div>
        );
    }

    /**
     * Components in the content can emit events with the same names as the
     * panel's events, for example `close` from `limel-dialog` or
     * `limel-collapsible-section`. Events from slotted content pass through the
     * element around the slot before they reach the host, so they are stopped
     * there. The panel's own events are dispatched on the host, so they are not
     * affected.
     *
     * Keep the event names in sync with {@link SidePanel.stopContentEventAtHost}.
     *
     * @param element - the element around a slot
     */
    private stopContentEvents = (element?: HTMLElement) => {
        // Adding the same listener again has no effect, so re-renders are safe.
        element?.addEventListener('close', stopEvent);
        element?.addEventListener('changeWidth', stopEvent);
    };

    /**
     * Fallback for {@link SidePanel.stopContentEvents}.
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

    private handleClickAction =
        (action: SidePanelAction) => (event: MouseEvent) => {
            this.selectAction.emit({
                id: action.id ?? action.type,
                event: event,
            });
        };

    private handleClickClose = () => {
        this.close.emit();
    };
}
