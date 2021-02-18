import { Component, Element, h, Prop, Watch } from '@stencil/core';
import { OpenDirection } from '../menu/menu.types';
import {
    createPopper,
    Instance,
    OptionsGeneric,
    Placement,
} from '@popperjs/core';
import { FlipModifier } from '@popperjs/core/lib/modifiers/flip';
import { arrowStyle } from './arrowStyle';

/* eslint-disable jsdoc/check-indentation */
/**
 * The portal component provides a way to render children into a DOM node that
 * exist outside the DOM hierarchy of the parent component.
 *
 * There are some caveats when using this component
 *
 * * Events might not bubble up as expected since the content is moved out to
 *   another DOM node.
 * * Any styling that is applied to content from the parent will be lost, if the
 *   content is just another web compoent it will work without any issues.
 *   Alternatively, use the
 *   `style=""` html attribute.
 * * Any component that is placed inside the container must have a style of
 *   `max-height: inherit`. This ensures that its placement is calculated
 *   correctly in relation to the trigger, and that it never covers its own
 *   trigger.
 * * When the node is moved in the DOM, `disconnectedCallback` and
 *   `connectedCallback` will be invoked, so if `disconnectedCallback` is used
 *   to do any tear-down, the appropriate setup will have to be done again on
 *   `connectedCallback`.
 *
 * @slot - Content to put inside the portal
 * @private
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
    @Prop()
    public openDirection: OpenDirection = 'right';

    /**
     * Position of the content.
     */
    @Prop()
    public position: 'fixed' | 'absolute' = 'absolute';

    /**
     * A unique ID.
     */
    @Prop()
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
    @Prop()
    public inheritParentWidth = false;

    /**
     * True if the content within the portal should be visible.
     *
     * If the content is from within a dialog for instance, this can be set to
     * true from false when the dialog opens to position the content properly.
     */
    @Prop()
    public visible = false;

    /**
     * Used to visulize the origin of the popper.
     */
    @Prop()
    public useArrow = false;

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

    @Element()
    private host: HTMLLimelPortalElement;

    private container: HTMLElement;

    private popperInstance: Instance;

    private loaded = false;

    private observer: IResizeObserver;

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

    private createContainer() {
        const slot: HTMLSlotElement = this.host.shadowRoot.querySelector(
            'slot'
        );
        const content =
            (slot.assignedElements && slot.assignedElements()) || [];

        this.container = document.createElement('div');
        this.container.setAttribute('id', this.containerId);
        this.container.setAttribute('class', 'limel-portal--container');
        Object.assign(this.container, {
            portalSource: this.host,
        });

        this.addArrow();

        content.forEach((element: HTMLElement) => {
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

    private addArrow() {
        if (!this.useArrow) {
            return;
        }

        const style = document.createElement('style');
        style.innerHTML = arrowStyle;

        this.container.appendChild(style);
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

        this.popperInstance = createPopper(this.host, this.container, config);
    }

    private destroyPopper() {
        this.popperInstance?.destroy();
        this.popperInstance = null;
    }

    private createPopperConfig(): Partial<
        OptionsGeneric<Partial<FlipModifier>>
    > {
        let placement: Placement = 'bottom-start';
        let flipPlacement: Placement = 'top-start';

        if (this.openDirection === 'left') {
            placement = 'bottom-end';
            flipPlacement = 'top-end';
        }

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
