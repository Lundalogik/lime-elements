import { Component, Element, h, Prop, Watch } from '@stencil/core';
import { OpenDirection } from '../menu/menu.types';
import {
    createPopper,
    Instance,
    OptionsGeneric,
    Placement,
} from '@popperjs/core';
import { FlipModifier } from '@popperjs/core/lib/modifiers/flip';

const IS_VISIBLE_CLASS = 'is-visible';
const IS_HIDING_CLASS = 'is-hiding';
const hideAnimationDuration = 300;

/**
 * The portal component provides a way to render children into a DOM node that
 * exist outside the DOM hierarchy of the parent component.
 *
 * When the limel-portal component is used, it creates a new DOM node (a div element)
 * and appends it to a parent element (by default, the body of the document).
 * The child elements of the limel-portal are then moved from
 * their original location in the DOM to this new div element.
 *
 * This technique is often used to overcome CSS stacking context issues,
 * or to render UI elements like modals, dropdowns, tooltips, etc.,
 * that need to visually "break out" of their container.
 *
 * Using this component, we ensure that the content is always rendered in the
 * correct position, and never covers its own trigger, or another component
 * that is opened in the stacking layer. This way, we don't need to worry about
 * z-indexes, or other stacking context issues.
 *
 * :::important
 * There are some caveats when using this component
 *
 * 1. Events might not bubble up as expected since the content is moved out to
 * another DOM node.
 * 2. Any styling that is applied to content from the parent will be lost, if the
 * content is just another web-component it will work without any issues.
 * Alternatively, use the `style=""` html attribute.
 * 3. Any component that is placed inside the container must have a style of
 * `max-height: inherit`. This ensures that its placement is calculated
 * correctly in relation to the trigger, and that it never covers its own
 * trigger.
 * 4. When the node is moved in the DOM, `disconnectedCallback` and
 * `connectedCallback` will be invoked, so if `disconnectedCallback` is used
 * to do any tear-down, the appropriate setup will have to be done again on
 * `connectedCallback`.
 * :::
 *
 * @slot - Content to put inside the portal
 * @private
 * @exampleComponent limel-example-portal-basic
 */
@Component({
    tag: 'limel-portal',
    shadow: true,
    styleUrl: 'portal.scss',
})
export class Portal {
    /**
     * Decides which direction the portal content should open.
     */
    @Prop({ reflect: true })
    public openDirection: OpenDirection = 'bottom';

    /**
     * Position of the content.
     */
    @Prop({ reflect: true })
    public position: 'fixed' | 'absolute' = 'absolute';

    /**
     * A unique ID.
     */
    @Prop({ reflect: true })
    public containerId: string;

    /**
     * Dynamic styling that can be applied to the container holding the content.
     */
    @Prop()
    public containerStyle: object = {};

    /**
     * Used to make a dropdown have the same width as the trigger, for example
     * in `limel-picker`.
     */
    @Prop({ reflect: true })
    public inheritParentWidth = false;

    /**
     * True if the content within the portal should be visible.
     *
     * If the content is from within a dialog for instance, this can be set to
     * true from false when the dialog opens to position the content properly.
     */
    @Prop({ reflect: true })
    public visible = false;

    /**
     * The element that the content should be positioned relative to.
     * Defaults to the limel-portal element.
     */
    @Prop()
    public anchor?: HTMLElement = null;

    @Element()
    private host: HTMLLimelPortalElement;

    private parents: WeakMap<HTMLElement, HTMLElement>;
    private container: HTMLElement;
    private popperInstance: Instance;
    private loaded = false;
    private observer: ResizeObserver;

    constructor() {
        this.parents = new WeakMap();
    }

    public disconnectedCallback() {
        this.removeContainer();
        this.destroyPopper();
        if (this.observer && this.container) {
            this.observer.unobserve(this.container);
        }

        this.container = null;
    }

    public connectedCallback() {
        if (!this.loaded) {
            return;
        }

        if (this.visible) {
            this.init();
        }
    }

    public componentDidLoad() {
        this.loaded = true;
        this.connectedCallback();
    }

    private init() {
        if (!this.host.isConnected) {
            return;
        }

        this.createContainer();
        this.hideContainer();
        this.attachContainer();
        this.styleContainer();

        if (this.visible) {
            this.createPopper();
            this.showContainer();
        }

        if ('ResizeObserver' in window) {
            this.observer = new ResizeObserver(() => {
                if (this.popperInstance) {
                    this.styleContainer();
                    this.popperInstance.update();
                }
            });
            this.observer.observe(this.container);
        }
    }

    public render() {
        return <slot />;
    }

    @Watch('visible')
    protected onVisible() {
        if (!this.container && this.visible) {
            this.init();

            return;
        }

        if (!this.visible) {
            this.animateHideAndCleanup();

            return;
        }

        this.styleContainer();
        this.createPopper();
        requestAnimationFrame(() => {
            this.showContainer();
        });
    }

    private createContainer() {
        const slot: HTMLSlotElement =
            this.host.shadowRoot.querySelector('slot');
        const content =
            (slot.assignedElements && slot.assignedElements()) || [];

        this.container = document.createElement('div');
        this.container.setAttribute('id', this.containerId);
        this.container.setAttribute('class', 'limel-portal--container');
        Object.assign(this.container, {
            portalSource: this.host,
        });

        content.forEach((element: HTMLElement) => {
            this.parents.set(element, element.parentElement);
            this.container.appendChild(element);
        });
    }

    private attachContainer() {
        this.getParent().appendChild(this.container);
    }

    private removeContainer() {
        if (!this.container) {
            return;
        }

        Array.from(this.container.children).forEach((element: HTMLElement) => {
            const parent = this.parents.get(element);
            if (!parent) {
                return;
            }

            parent.appendChild(element);
        });

        this.container.parentElement.removeChild(this.container);
    }

    private hideContainer() {
        if (!this.container) {
            return;
        }

        this.container.classList.remove(IS_VISIBLE_CLASS);
    }

    private showContainer() {
        this.container.classList.add(IS_VISIBLE_CLASS);
    }

    private animateHideAndCleanup() {
        if (!this.container) {
            return;
        }

        this.container.classList.add(IS_HIDING_CLASS);
        this.styleContainer();

        setTimeout(() => {
            this.container.classList.remove(IS_HIDING_CLASS);
            if (!this.visible) {
                this.container.classList.remove(IS_VISIBLE_CLASS);
                this.destroyPopper();
            }
        }, hideAnimationDuration);
    }

    private styleContainer() {
        this.setContainerWidth();
        this.setContainerHeight();
        this.setContainerStyles();
    }

    private setContainerWidth() {
        const hostWidth = this.host.getBoundingClientRect().width;

        if (this.inheritParentWidth) {
            const containerWidth = this.getContentWidth(this.container);
            let width = containerWidth;
            if (hostWidth > 0) {
                width = hostWidth;
            }

            this.container.style.width = `${width}px`;
        }
    }

    private getContentWidth(element: HTMLElement | Element) {
        if (!element) {
            return null;
        }

        const width = element.getBoundingClientRect().width;
        if (width !== 0) {
            return width;
        }

        const elementContent = element.querySelector('*');

        return this.getContentWidth(elementContent);
    }

    private setContainerStyles() {
        Object.keys(this.containerStyle).forEach((property) => {
            this.container.style[property] = this.containerStyle[property];
        });
    }

    private createPopper() {
        const config = this.createPopperConfig();

        this.popperInstance = createPopper(
            this.anchor || this.host,
            this.container,
            config,
        );
    }

    private destroyPopper() {
        this.popperInstance?.destroy();
        this.popperInstance = null;
    }

    private createPopperConfig(): Partial<
        OptionsGeneric<Partial<FlipModifier>>
    > {
        const placement = this.getPlacement(this.openDirection);
        const flipPlacement = this.getFlipPlacement(this.openDirection);

        return {
            strategy: this.position,
            placement: placement,
            modifiers: [
                {
                    name: 'flip',
                    options: {
                        fallbackPlacements: [flipPlacement],
                    },
                },
            ],
        };
    }

    private getPlacement(direction: OpenDirection): Placement {
        const placements: Record<OpenDirection, Placement> = {
            'left-start': 'left-start',
            left: 'left',
            'left-end': 'left-end',
            'right-start': 'right-start',
            right: 'right',
            'right-end': 'right-end',
            'top-start': 'top-start',
            top: 'top',
            'top-end': 'top-end',
            'bottom-start': 'bottom-start',
            bottom: 'bottom',
            'bottom-end': 'bottom-end',
        };

        return placements[direction];
    }

    private getFlipPlacement(direction: OpenDirection): Placement {
        const flipPlacements: Record<OpenDirection, Placement> = {
            'left-start': 'right-start',
            left: 'right',
            'left-end': 'right-end',
            'right-start': 'left-start',
            right: 'left',
            'right-end': 'left-end',
            'top-start': 'bottom-start',
            top: 'bottom',
            'top-end': 'bottom-end',
            'bottom-start': 'top-start',
            bottom: 'top',
            'bottom-end': 'top-end',
        };

        return flipPlacements[direction];
    }

    private setContainerHeight() {
        const viewHeight = Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0,
        );

        const { top, bottom } = this.host.getBoundingClientRect();
        const spaceAboveTopOfSurface = Math.max(top, 0);
        const spaceBelowTopOfSurface = Math.max(viewHeight - bottom, 0);
        const extraCosmeticSpace = 16;
        const maxHeight =
            Math.max(spaceAboveTopOfSurface, spaceBelowTopOfSurface) -
            extraCosmeticSpace;

        this.container.style.maxHeight = `${maxHeight}px`;
    }

    // Returns the parent element where the content of the portal will be moved to.
    // It needs to have styling of the portal container.
    private getParent() {
        let element: Element | undefined = this.anchor || this.host;

        while (element) {
            const parent = element.closest('.limel-portal--parent');
            if (parent) {
                return parent;
            }

            element = (element.getRootNode() as ShadowRoot).host;
        }

        return document.body;
    }
}
