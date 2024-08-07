import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';
import { OpenDirection } from '../menu/menu.types';
import {
    createPopper,
    Instance,
    OptionsGeneric,
    Placement,
} from '@popperjs/core';
import { FlipModifier } from '@popperjs/core/lib/modifiers/flip';

/**
 * The portal component provides a way to render children in the top layer of
 * the document (https://developer.mozilla.org/en-US/docs/Glossary/Top_layer)
 *
 * When the limel-portal component is used, it renders a container with the
 * `popover` attribute set to `manual` in order to render all content on top of
 * everything else.
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
 * 1. Any component that is placed inside the container must have a style of
 * `max-height: inherit`. This ensures that its placement is calculated
 * correctly in relation to the trigger, and that it never covers its own
 * trigger.
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

    private popperInstance: Instance;
    private loaded = false;
    private observer: ResizeObserver;

    public disconnectedCallback() {
        this.destroyPopper();
        if (this.observer) {
            this.observer.unobserve(this.container);
        }
    }

    public connectedCallback() {
        if (!this.loaded) {
            return;
        }

        if (this.containerId) {
            // eslint-disable-next-line no-console
            console.warn(
                'The `containerId` prop is no longer needed. It is deprecated and will be removed in a future release.',
            );
        }

        this.hideContainer();
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

    public componentDidRender() {
        this.loaded = true;
        this.connectedCallback();
    }

    public render() {
        return (
            <Host
                onChange={this.stopEventPropagation}
                onClick={this.stopEventPropagation}
            >
                <div popover="manual">
                    <slot />
                </div>
            </Host>
        );
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

    private hideContainer() {
        // @ts-ignore
        this.container?.hidePopover();
    }

    private showContainer() {
        // @ts-ignore
        this.container?.showPopover();
    }

    private styleContainer() {
        if (!this.container) {
            return;
        }

        const hostWidth = this.host.getBoundingClientRect().width;

        if (this.inheritParentWidth) {
            const containerWidth = this.getContentWidth(this.container);
            let width = containerWidth;
            if (hostWidth > 0) {
                width = hostWidth;
            }

            this.container.style.width = `${width}px`;
        }

        this.ensureContainerFitsInViewPort();
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

    private ensureContainerFitsInViewPort() {
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

    private stopEventPropagation = (event: Event) => event.stopPropagation();

    private get container(): HTMLElement {
        return this.host.shadowRoot.querySelector('[popover]');
    }
}
