import {
    Component,
    h,
    Prop,
    Element,
    Event,
    EventEmitter,
    Watch,
} from '@stencil/core';
import { createRandomString } from '../../util/random-string';
import { zipObject } from 'lodash-es';
import { portalContains } from '../portal/contains';
import { ESCAPE } from '../../util/keycodes';
import { OpenDirection } from '../menu/menu.types';
import { focusTriggerElement } from '../../util/focus-trigger-element';

/**
 * A popover is an impermanent layer that is displayed on top of other content
 * when user taps an element that triggers the popover. This element can be
 * practically anything, a button, piece of text, and icon, etc.
 *
 * Popovers are nonmodal, thus they don't have a semi-transparent backdrop layer
 * that darkens the content below them. Also for the same reason, they can be
 * dismissed by tapping or clicking another part of the screen, but not by a
 * clicking a button or link on the popover itself.
 *
 * ## Usage
 * Use a popover to show **options** or **information** related to the trigger
 * onscreen. A typical use case for popovers is a tooltip, in which you show
 * help text or contextual information to users.
 *
 * Popovers are most appropriate on larger screens but can be used on smaller
 * screens too, as long as their content is responsive and takes into account
 * the context they are displayed on.
 *
 * When a popover is displayed, interactions with other controls are blocked,
 * until user dismisses the popover.
 *
 *
 * ## Layout
 * Popovers has only one slot in which you can import a custom web-component.
 *
 * :::note
 * You must make sure that web-components that you import into the slot has
 * a `width: 100%;` style so that it can horizontally stretch across the popover.
 *
 * However, `width` of the popover can be controlled by specifying a CSS variable
 * of `--popover-surface-width`. If you don't specify any width, the popover
 * will grow as wide as its content.
 * :::
 *
 * :::important
 * Do not make a popover too big. They should never take over the entire screen.
 * If your content is that big, you should probably be using a Modal instead.
 * :::
 *
 * @slot - Content to put inside the surface
 * @exampleComponent limel-example-popover-basic
 * @exampleComponent limel-example-popover-trigger-interaction
 * @exampleComponent limel-example-popover-styling
 */
@Component({
    tag: 'limel-popover',
    shadow: true,
    styleUrl: 'popover.scss',
})
export class Popover {
    /**
     * True if the content within the popover should be visible
     */
    @Prop()
    public open = false;

    /**
     * Decides the popover's location in relation to its trigger
     */
    @Prop({ reflect: true })
    public openDirection: OpenDirection;

    /**
     * Says what kind of popup the trigger opens, so that a screen reader can
     * announce it. Use the one that fits what you put in the popover: `dialog`
     * for a form, a message or other content, and `menu`, `listbox`, `tree`
     * or `grid` when the content is one of those widgets.
     *
     * A popup with one of these roles needs a name, so the role is used only
     * together with `accessibleLabel`. Without one, the popover warns in the
     * console.
     *
     * When the role is not set or not used, the trigger only says that it
     * opens a popup.
     */
    @Prop()
    public popupRole?: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';

    /**
     * The name of the popup, which a screen reader announces when the focus
     * moves into it. Used together with `popupRole`.
     */
    @Prop()
    public accessibleLabel?: string;

    /**
     * Emits an event when the component is closing
     */
    @Event()
    private close: EventEmitter<void>;

    @Element()
    private host: HTMLLimelPopoverElement;

    private portalId: string;
    private triggerSlot: HTMLSlotElement;
    private shouldRestoreFocusOnClose = false;
    private hasWarnedAboutMissingName = false;

    constructor() {
        this.portalId = createRandomString();
        this.globalClickListener = this.globalClickListener.bind(this);
    }

    @Watch('open')
    protected watchOpen() {
        this.setupGlobalHandlers();

        if (this.open || !this.shouldRestoreFocusOnClose) {
            return;
        }

        this.shouldRestoreFocusOnClose = false;
        setTimeout(this.focusTrigger, 0);
    }

    public connectedCallback() {
        this.setupGlobalHandlers();
    }

    public disconnectedCallback() {
        this.teardownGlobalHandlers();
    }

    public componentWillRender() {
        this.warnIfRoleHasNoName();
    }

    public componentDidRender() {
        if (!this.triggerSlot) {
            return;
        }

        for (const element of this.triggerSlot.assignedElements()) {
            this.setTriggerAttributes(element as HTMLElement);
        }
    }

    private setupGlobalHandlers() {
        // Stencil keeps firing `@Watch` on a detached instance, so `open` can
        // still flip after `disconnectedCallback` has run. Listening then
        // would swallow every click on the page, with no disconnect left to
        // undo it.
        if (!this.open || !this.host.isConnected) {
            this.teardownGlobalHandlers();

            return;
        }

        document.addEventListener('click', this.globalClickListener, {
            capture: true,
        });
        document.addEventListener('keydown', this.handleGlobalKeyPress);
    }

    /**
     * The capture flag has to be given again: `removeEventListener` only
     * matches a listener registered with the same one, so leaving it out here
     * left the click listener on `document` for good.
     */
    private teardownGlobalHandlers() {
        document.removeEventListener('click', this.globalClickListener, {
            capture: true,
        });
        document.removeEventListener('keydown', this.handleGlobalKeyPress);
    }

    public render() {
        const cssProperties = this.getCssProperties();
        const popoverZIndex = getComputedStyle(this.host).getPropertyValue(
            '--popover-z-index'
        );

        return (
            <div class="trigger-anchor">
                <slot name="trigger" ref={this.setTriggerRef} />
                <limel-portal
                    visible={this.open}
                    containerId={this.portalId}
                    containerStyle={{ 'z-index': popoverZIndex }}
                    openDirection={this.openDirection}
                >
                    <limel-popover-surface
                        contentCollection={this.host.children}
                        popupRole={this.getNamedPopupRole()}
                        accessibleLabel={this.accessibleLabel}
                        style={cssProperties}
                    />
                </limel-portal>
            </div>
        );
    }

    private globalClickListener(event: MouseEvent) {
        const element: HTMLElement = event.target as HTMLElement;
        const clickedInside = portalContains(this.host, element);
        if (!this.open || clickedInside) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();
        this.close.emit();
    }

    private getCssProperties() {
        const propertyNames = [
            '--popover-surface-width',
            '--popover-body-background-color',
            '--popover-border-radius',
            '--popover-box-shadow',
        ];
        const style = getComputedStyle(this.host);
        const values = propertyNames.map((property) => {
            return style.getPropertyValue(property);
        });

        return zipObject(propertyNames, values);
    }

    private handleGlobalKeyPress = (event: KeyboardEvent) => {
        if (event.key !== ESCAPE) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();
        this.requestCloseAndRestoreFocus();
    };

    private readonly requestCloseAndRestoreFocus = () => {
        this.shouldRestoreFocusOnClose = true;
        this.close.emit();
    };

    private readonly setTriggerRef = (elm?: HTMLSlotElement) => {
        this.triggerSlot = elm;
    };

    private readonly focusTrigger = () => {
        const trigger = this.triggerSlot?.assignedElements()?.[0] as
            HTMLElement | undefined;

        focusTriggerElement(trigger);
    };

    private setTriggerAttributes = (element: HTMLElement) => {
        element.setAttribute(
            'aria-haspopup',
            this.getNamedPopupRole() ?? 'true'
        );
        // `aria-expanded` is needed even when the popover is closed. Without
        // it, the trigger reads as an ordinary button to a screen reader.
        element.setAttribute('aria-expanded', this.open ? 'true' : 'false');
        this.setControlledPopup(element);
        element.setAttribute('role', 'button');
    };

    private getNamedPopupRole() {
        return this.accessibleLabel ? this.popupRole : undefined;
    }

    private warnIfRoleHasNoName() {
        const hasNoName = !!this.popupRole && !this.accessibleLabel;

        if (hasNoName && !this.hasWarnedAboutMissingName) {
            console.warn(
                `limel-popover: popupRole is "${this.popupRole}", but there is no accessibleLabel to name the popup. The role is not used until the popup has a name.`
            );
        }

        this.hasWarnedAboutMissingName = hasNoName;
    }

    private setControlledPopup(element: HTMLElement) {
        const popup = document.querySelector(`#${this.portalId}`);

        if ('ariaControlsElements' in element) {
            element.ariaControlsElements = popup ? [popup] : null;

            return;
        }

        element.setAttribute('aria-controls', this.portalId);
    }
}
