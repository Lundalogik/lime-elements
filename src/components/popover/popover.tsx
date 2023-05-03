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
 * :::warning
 * The component is emitting a close event when you click outside its container
 * or press the <kbd>Esc</kbd> key. However, it’s up to you as consumer to react
 * properly on this event and hide the component (preferably by setting the
 * property `open` to `false`).
 * :::
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
 * @slot - Content to put inside the surface
 * @exampleComponent limel-example-popover
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
     * Emits an event when the component is closing
     */
    @Event()
    private close: EventEmitter<void>;

    @Element()
    private host: HTMLLimelPopoverElement;

    private portalId: string;

    constructor() {
        this.portalId = createRandomString();
        this.globalClickListener = this.globalClickListener.bind(this);
    }

    @Watch('open')
    protected watchOpen() {
        this.setupGlobalHandlers();
    }

    public componentWillLoad() {
        this.setupGlobalHandlers();
    }

    private setupGlobalHandlers() {
        if (this.open) {
            document.addEventListener('click', this.globalClickListener, {
                capture: true,
            });
            document.addEventListener('keyup', this.handleGlobalKeyPress);
        } else {
            document.removeEventListener('click', this.globalClickListener);
            document.removeEventListener('keyup', this.handleGlobalKeyPress);
        }
    }

    public render() {
        const cssProperties = this.getCssProperties();
        const popoverZIndex = getComputedStyle(this.host).getPropertyValue(
            '--popover-z-index'
        );

        return (
            <div class="trigger-anchor">
                <slot name="trigger"></slot>
                <limel-portal
                    visible={this.open}
                    containerId={this.portalId}
                    containerStyle={{ 'z-index': popoverZIndex }}
                    openDirection={this.openDirection}
                >
                    <limel-popover-surface
                        contentCollection={this.host.children}
                        style={cssProperties}
                    />
                </limel-portal>
            </div>
        );
    }

    private globalClickListener(event: MouseEvent) {
        const element: HTMLElement = event.target as HTMLElement;
        const clickedInside = portalContains(this.host, element);
        if (this.open && !clickedInside) {
            event.stopPropagation();
            event.preventDefault();
            this.close.emit();
        }
    }

    private getCssProperties() {
        const propertyNames = [
            '--popover-surface-width',
            '--popover-body-background-color',
            '--popover-border-radius',
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
        this.close.emit();
    };
}
