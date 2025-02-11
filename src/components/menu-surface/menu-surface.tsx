import { Corner, MDCMenuSurface } from '@material/menu-surface';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
} from '@stencil/core';
import { isDescendant } from '../../util/dom';
import { ESCAPE, TAB } from '../../util/keycodes';

/**
 * @slot - Content to put inside the surface
 * @private
 */
@Component({
    tag: 'limel-menu-surface',
    shadow: true,
    styleUrl: 'menu-surface.scss',
})
export class MenuSurface {
    /**
     * True if the menu surface is open, false otherwise
     */
    @Prop()
    public open = false;

    /**
     * Clicks in this element should not be prevented when the menu surface is open
     */
    @Prop()
    public allowClicksElement: HTMLElement;

    /**
     * Emitted when the menu surface is dismissed and should be closed
     */
    @Event()
    public dismiss: EventEmitter<void>;

    @Element()
    private host: HTMLLimelMenuSurfaceElement;

    private menuSurface: MDCMenuSurface;

    public connectedCallback() {
        this.setup();
    }

    public disconnectedCallback() {
        this.teardown();
    }

    public componentDidLoad() {
        this.setup();
    }

    public render() {
        const classList = {
            'mdc-menu': true,
            'mdc-menu-surface': true,
            'mdc-menu-surface--open': this.open,
            'mdc-elevation-transition': true,
            'mdc-elevation--z4': true,
        };

        return (
            <div class={classList} tabindex="-1">
                <slot />
            </div>
        );
    }

    private setup = () => {
        const menuElement: HTMLElement =
            this.host.shadowRoot.querySelector('.mdc-menu-surface');
        if (!menuElement) {
            return;
        }

        this.menuSurface = new MDCMenuSurface(menuElement);
        this.menuSurface.setAnchorCorner(Corner.TOP_START);

        document.addEventListener('mousedown', this.handleDocumentClick, {
            capture: true,
        });
        this.host.addEventListener('keydown', this.handleKeyDown);
    };

    private teardown = () => {
        this.menuSurface?.destroy();
        document.removeEventListener('mousedown', this.handleDocumentClick, {
            capture: true,
        });
        this.host.removeEventListener('keydown', this.handleKeyDown);
    };

    private handleDocumentClick = (event) => {
        const elementPath = event.composedPath ? event.composedPath() : [];

        if (!this.open) {
            return;
        }

        if (isDescendant(event.target, this.host)) {
            return;
        }

        if (this.allowClicksElement) {
            const clickedInAllowedElement = elementPath.includes(
                this.allowClicksElement,
            );

            if (clickedInAllowedElement) {
                return;
            }
        }

        this.dismiss.emit();
        this.preventClickEventPropagation();
    };

    private preventClickEventPropagation = () => {
        // When the menu surface is open, we want to stop the `click` event from propagating
        // when clicking outside the surface itself. This is to prevent any dialog that might
        // be open from closing, etc. However, when dragging a scrollbar no `click` event is emitted,
        // only mousedown and mouseup. So we listen for `mousedown` and attach a one-time listener
        // for `click`, so we can capture and "kill" it.
        document.addEventListener('click', this.stopEvent, {
            capture: true,
            once: true,
        });
        // We also capture and "kill" the next `mouseup` event.
        document.addEventListener('mouseup', this.stopEvent, {
            capture: true,
            once: true,
        });
        // If the user dragged the scrollbar, no `click` event happens. So when we get the
        // `mouseup` event, remove the handler for `click` if it's still there.
        // Otherwise, we would catch the next click even though the menu is no longer open.
        document.addEventListener(
            'mouseup',
            () => {
                document.removeEventListener('click', this.stopEvent, {
                    capture: true,
                });
            },
            {
                once: true,
            },
        );
    };

    private stopEvent = (event) => {
        event.stopPropagation();
        event.preventDefault();
    };

    private handleKeyDown = (event: KeyboardEvent) => {
        const isEscape = event.key === ESCAPE;
        const isTab = event.key === TAB;

        if (this.open && (isEscape || isTab)) {
            event.stopPropagation();
            this.dismiss.emit();
        }
    };
}
