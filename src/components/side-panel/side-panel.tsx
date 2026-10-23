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
import translate from '../../global/translations';
import { getDeepActiveElement } from '../../util/get-deep-active-element';
import { ESCAPE } from '../../util/keycodes';
import { createRandomString } from '../../util/random-string';
import { Languages } from '../date-picker/date.types';
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
 * It does not block the rest of the page. Place it in an element with
 * `position: relative`.
 *
 * The panel has:
 * - a toolbar with a close button, and buttons from `actions`
 * - a header that shows the last entry of `stack`, with a slot for controls
 * - backs behind its left edge, for the other entries of `stack`
 * - a handle on its left edge, to resize the panel
 * - a full screen mode, for small screens
 *
 * The panel emits `close`, but does not remove itself. The consumer must
 * remove it from the DOM.
 *
 * Each example shows one feature in detail, and when to use it.
 *
 * @exampleComponent limel-example-side-panel-basic
 * @exampleComponent limel-example-side-panel-insets
 * @exampleComponent limel-example-side-panel-escape
 * @exampleComponent limel-example-side-panel-actions
 * @exampleComponent limel-example-side-panel-header-actions
 * @exampleComponent limel-example-side-panel-stacking
 * @exampleComponent limel-example-side-panel-full-screen
 * @exampleComponent limel-example-side-panel-accessibility
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
     *
     * The resize handle is named after it, for example "Resize Customer
     * details panel". When no label is set, the handle is named "Resize side
     * panel".
     */
    @Prop()
    public label?: string;

    /**
     * Defines the language for translations.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

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
     * Whether pressing Escape emits `close`. Set to `false` to let only the
     * close button emit `close`. The panel then does not prevent the Escape
     * event either.
     */
    @Prop()
    public closeOnEscape = true;

    /**
     * Set to `true` when the screen is too narrow for the panel to be displayed
     * on top of the page. The panel then covers the full width of the
     * positioned ancestor. It cannot be resized, and the backs of the stack are
     * not shown.
     */
    @Prop({ reflect: true })
    public fullScreen = false;

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

    private panel: HTMLElement;
    private minLimit?: HTMLElement;
    private maxLimit?: HTMLElement;
    private closeButtonId = createRandomString();
    private actionIdPrefix = createRandomString();
    private backIdPrefix = createRandomString();
    private widthObserver?: ResizeObserver;
    private focusCloseButtonAfterRender = false;

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

    // A removed button takes the focus with it, so a keyboard user that goes
    // back would lose their place in the page. Both props can change in the
    // same update, so the result comes from both, and not from the prop that
    // changed last.
    @Watch('stack')
    @Watch('fullScreen')
    protected handleBacksChange() {
        this.focusCloseButtonAfterRender = this.isFocusedBackRemoved();
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
                {this.renderStack()}
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

    private renderStack() {
        const backs = this.stack.slice(0, -1);
        if (this.fullScreen || backs.length === 0) {
            return;
        }

        return (
            <div class="stack">
                {backs.map((entry, index) => this.renderBack(entry, index))}
            </div>
        );
    }

    private isFocusedBackRemoved(): boolean {
        const backs = [...this.host.shadowRoot.querySelectorAll('.back')];
        const index = backs.indexOf(this.host.shadowRoot.activeElement);
        if (index === -1) {
            return false;
        }

        return this.fullScreen || index >= this.stack.length - 1;
    }

    private renderBack = (entry: SidePanelEntry, index: number) => {
        const id = `${this.backIdPrefix}-${index}`;

        return (
            <button
                class="back"
                id={id}
                style={{ width: this.panel?.style.width }}
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
                    openDirection="left"
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
            <limel-header
                class={{ header: true, 'has-color': !!entry.color }}
                style={{ '--header-background-color': entry.color }}
                icon={entry.icon}
                heading={entry.heading}
                subheading={entry.subheading}
            >
                <div
                    class="header-actions"
                    slot="actions"
                    ref={this.stopContentEvents}
                >
                    <slot name="header-actions" />
                </div>
            </limel-header>
        );
    }

    private renderHandle() {
        if (this.fullScreen) {
            return;
        }

        return (
            <limel-resize-handle
                class="handle"
                resizableRegionLabel={this.getRegionLabel()}
                language={this.language}
                value={this.widthRange?.now}
                min={this.widthRange?.min}
                max={this.widthRange?.max}
                onChangeSize={this.handleChangeSize}
                onEndResize={this.handleEndResize}
            />
        );
    }

    private getRegionLabel(): string {
        if (!this.label) {
            return translate.get('side-panel.resize-region', this.language);
        }

        return translate.get('side-panel.resize-region.named', this.language, {
            label: this.label,
        });
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
    // the drag slow when the content is large. The backs of the stack get the
    // width too, so that they have the same width as the panel.
    private setWidth(width: number) {
        for (const element of this.getPanelBoxes()) {
            element.style.width = `${width}px`;
        }
    }

    private getPanelBoxes(): HTMLElement[] {
        const backs =
            this.host.shadowRoot.querySelectorAll<HTMLElement>('.back');

        return [this.panel, ...backs];
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

    private handleClickBack = (index: number) => () => {
        this.selectStackEntry.emit(index);
    };

    private handleClickClose = () => {
        this.close.emit();
    };
}
