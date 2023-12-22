import { Component, Element, h, Prop, Watch } from '@stencil/core';
import { OpenDirection } from '../../interface';
import {
    createPopper,
    Instance,
    OptionsGeneric,
    Placement,
} from '@popperjs/core';
import { FlipModifier } from '@popperjs/core/lib/modifiers/flip';

/* eslint-disable jsdoc/check-indentation */
/**
 * The portal component provides a way to render children into a DOM node that
 * exist outside the DOM hierarchy of the parent component.
 *
 * There are some caveats when using this component
 *
 * Events might not bubble up as expected since the content is moved out to
 * another DOM node.
 * Any styling that is applied to content from the parent will be lost, if the
 * content is just another web compoent it will work without any issues.
 * Alternatively, use the
 * `style=""` html attribute.
 * Any component that is placed inside the container must have a style of
 * `max-height: inherit`. This ensures that its placement is calculated
 * correctly in relation to the trigger, and that it never covers its own
 * trigger.
 * When the node is moved in the DOM, `disconnectedCallback` and
 * `connectedCallback` will be invoked, so if `disconnectedCallback` is used
 * to do any tear-down, the appropriate setup will have to be done again on
 * `connectedCallback`.
 * @slot - Content to put inside the portal
 * @private
 * @exampleComponent limel-example-portal-basic
 */
/* eslint-enable jsdoc/check-indentation */
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
     * Parent element to move the content to.
     */
    @Prop()
    public parent: HTMLElement = document.body;

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
        if (this.observer) {
            this.observer.unobserve(this.container);
        }
    }

    public connectedCallback() {
        if (!this.loaded) {
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
            const observer = new ResizeObserver(() => {
                if (this.popperInstance) {
                    this.styleContainer();
                    this.popperInstance.update();
                }
            });
            observer.observe(this.container);
        }
    }

    public componentDidLoad() {
        this.loaded = true;
        this.connectedCallback();
    }

    public render() {
        return <slot />;
    }

    @Watch('visible')
    protected onVisible() {
        if (!this.visible) {
            this.hideContainer();
            this.styleContainer();
            this.destroyPopper();

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
        this.parent.appendChild(this.container);
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

        this.hideContainer();
        this.container.parentElement.removeChild(this.container);
    }

    private hideContainer() {
        this.container.style.opacity = '0';
    }

    private showContainer() {
        this.container.style.opacity = '1';
    }

    private styleContainer() {
        const hostWidth = this.host.getBoundingClientRect().width;

        if (this.visible) {
            this.container.style.display = 'block';
        } else {
            this.container.style.display = 'none';
        }

        if (this.inheritParentWidth) {
            const containerWidth = this.getContentWidth(this.container);
            let width = containerWidth;
            if (hostWidth > 0) {
                width = hostWidth;
            }

            this.container.style.width = `${width}px`;
        }

        this.ensureContainerFitsInViewPort();

        Object.keys(this.containerStyle).forEach((property) => {
            this.container.style[property] = this.containerStyle[property];
        });
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

    private createPopper() {
        const config = this.createPopperConfig();

        this.popperInstance = createPopper(
            this.anchor || this.host,
            this.container,
            config
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

    private ensureContainerFitsInViewPort() {
        const viewHeight = Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0
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
}
