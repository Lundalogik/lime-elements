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
    Watch,
} from '@stencil/core';
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
 * ## Stack
 *
 * A panel can open another panel, for example to edit a part of what the first
 * panel shows. Only one panel is shown at a time. The other panels are shown as
 * backs behind the left edge of the panel, so the user can go back to them.
 *
 * Each entry in `stack` is one panel, outermost first. The last entry is the
 * panel that is shown, and the other entries are the backs. To open a panel,
 * add an entry at the end of `stack`, and change the content. A back is too
 * narrow for text, so it only shows the `color` of its entry. Its heading and
 * subheading are shown in a tooltip.
 *
 * When the user clicks a back, the panel emits `selectStackEntry` with the
 * index of its entry in `stack`. To go back to that panel, remove all entries
 * after it, and change the content.
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
 * ## Full screen
 *
 * On a small screen, there is no space for the panel next to the page. Set
 * `fullScreen` to let the panel cover the full width of the positioned
 * ancestor. The top and bottom insets are kept. The panel then cannot be
 * resized, and the backs of the stack are not shown. The header still shows
 * the last entry of `stack`.
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
 * @exampleComponent limel-example-side-panel-actions
 * @exampleComponent limel-example-side-panel-header-actions
 * @exampleComponent limel-example-side-panel-stacking
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
     * Label of the close button. Shown as a tooltip and used as the accessible
     * name.
     */
    @Prop()
    public closeLabel = 'Close';

    /**
     * The panels in the stack, outermost first. The last entry is the panel
     * that is displayed. Its heading, subheading and icon are shown in the
     * header. The other entries are shown as backs behind the panel.
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
     * Set to `true` when the screen is too narrow for the panel to be displayed
     * on top of the page. The panel then covers the full width of the
     * positioned ancestor. It cannot be resized, and the backs of the stack are
     * not shown.
     */
    @Prop({ reflect: true })
    public fullScreen = false;

    /**
     * Emitted when the close button is clicked, or when Escape is pressed.
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
     * Emitted when the user has resized the panel. The detail is the new width
     * in pixels. The panel already uses the new width. Store the value to
     * restore the width with `--side-panel-width` the next time the panel opens.
     */
    @Event()
    public changeWidth: EventEmitter<number>;

    /**
     * Emitted when a back of the stack is clicked. The detail is the index of
     * its entry in `stack`.
     */
    @Event()
    public selectStackEntry: EventEmitter<number>;

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
    private closeButtonId = createRandomString();
    private actionIdPrefix = createRandomString();
    private backIdPrefix = createRandomString();
    private widthObserver?: ResizeObserver;
    private focusCloseButtonAfterRender = false;

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

    // A removed button takes the focus with it, so a keyboard user that goes
    // back would lose their place in the page.
    @Watch('stack')
    protected handleStackChange(stack: SidePanelEntry[]) {
        this.focusCloseButtonAfterRender = this.isFocusedBackRemovedBy(stack);
    }

    public componentDidRender() {
        if (!this.focusCloseButtonAfterRender) {
            return;
        }

        this.focusCloseButtonAfterRender = false;
        this.host.shadowRoot
            .querySelector<HTMLButtonElement>('button.close')
            ?.focus();
    }

    public render() {
        return (
            <Host>
                <aside ref={this.setPanel} style={this.getPanelStyle()}>
                    {this.renderHandle()}
                    <div class="content">
                        <div class="toolbar">
                            {this.renderCloseButton()}
                            {this.renderActions()}
                        </div>
                        {this.renderHeader()}
                        {this.renderBody()}
                    </div>
                </aside>
                {this.renderStack()}
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

        return <div class="actions">{this.actions.map(this.renderAction)}</div>;
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

    private renderStack() {
        const backs = this.stack.slice(0, -1);
        if (this.fullScreen || backs.length === 0) {
            return;
        }

        return <div class="stack">{backs.map(this.renderBack)}</div>;
    }

    private isFocusedBackRemovedBy(stack: SidePanelEntry[]): boolean {
        const backs = [...this.host.shadowRoot.querySelectorAll('.back')];
        const index = backs.indexOf(this.host.shadowRoot.activeElement);

        return index !== -1 && index >= stack.length - 1;
    }

    private renderBack = (entry: SidePanelEntry, index: number) => {
        const id = `${this.backIdPrefix}-${index}`;

        return (
            <button
                class="back"
                id={id}
                style={this.getPanelStyle()}
                aria-label={entry.heading}
                onClick={this.handleClickBack(index)}
            >
                <span class="back-toolbar" />
                <span
                    class="back-band"
                    style={{ 'background-color': entry.color }}
                />
                <limel-tooltip
                    elementId={id}
                    label={entry.heading}
                    helperLabel={entry.subheading}
                />
            </button>
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
        if (this.fullScreen) {
            return;
        }

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
    // `min-width` and `max-width`. The backs of the stack use it too, so that
    // they have the same width as the panel.
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

    private handleClickAction =
        (action: SidePanelAction) => (event: MouseEvent) => {
            this.selectAction.emit({
                id: action.id ?? action.type,
                event: event,
            });
        };

    private handleClickBack = (index: number) => () => {
        this.selectStackEntry.emit(index);
    };

    private handleClickClose = () => {
        this.close.emit();
    };
}
