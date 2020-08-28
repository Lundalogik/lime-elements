import { Component, Element, h, Prop, Watch } from '@stencil/core';
import { OpenDirection } from '../menu/menu.types';
import { createPopper, Instance, OptionsGeneric } from '@popperjs/core';
import { FlipModifier } from '@popperjs/core/lib/modifiers/flip';

/**
 * The portal component provides a way to render children into a DOM node that exist outside
 * the DOM hierarchy of the parent component.
 *
 * There are some caveats when using this component
 *
 * * Events might not bubble up as expected since the content is moved out to another DOM node
 * * Any styling that is applied to content from the parent will be lost, if the content is
 * just another web compoent it will work without any issues
 * * When the node is moved in the DOM, `disconnectedCallback` and `connectedCallback`
 * will be invoked, so if `disconnectedCallback` is used to do any tear-down, the
 * appropriate setup will have to be done again on `connectedCallback`
 *
 * @slot - Content to put inside the portal
 */
@Component({
    tag: 'limel-portal',
    shadow: true,
    styleUrl: 'portal.scss',
})
export class Portal {
    /**
     * Decides which direction the portal content should open. Defaults to right.
     */
    @Prop()
    public openDirection: OpenDirection = 'right';

    /**
     * Position of the content
     */
    @Prop()
    public position: 'fixed' | 'absolute' = 'absolute';

    /**
     * A unique ID
     */
    @Prop()
    public containerId: string;

    /**
     * Dynamic styling that can be applied to the container holding the content
     */
    @Prop()
    public containerStyle: object = {};

    /**
     * Parent element to move the content to
     */
    @Prop()
    public parent: HTMLElement = document.body;

    /**
     * Used to make a dropdown have the same width as the trigger, for example
     * in `limel-picker`
     */
    @Prop()
    public inheritParentWidth = false;

    /**
     * True if the content within the portal should be visible
     *
     * If the content is from within a dialog for instance, this can be set to
     * true from false when the dialog opens to position the content properly
     */
    @Prop()
    public visible = false;

    @Watch('visible')
    protected onVisible() {
        if (!this.visible) {
            return;
        }

        if (!this.popperInstance) {
            return;
        }

        setTimeout(() => {
            const popperConfig = this.createPopperConfig();
            this.popperInstance.setOptions(popperConfig);
            this.showContainer();
        });
    }

    @Element()
    private host: HTMLLimelPortalElement;

    private container: HTMLElement;

    private popperInstance: Instance;

    private loaded = false;

    public disconnectedCallback() {
        this.removeContainer();
        this.popperInstance?.destroy();
        this.popperInstance = null;
    }

    public connectedCallback() {
        if (!this.loaded) {
            return;
        }

        this.createContainer();
        this.hideContainer();
        this.attachContainer();
        this.styleContainer();

        const popperConfig = this.createPopperConfig();
        this.popperInstance = createPopper(
            this.host,
            this.container,
            popperConfig
        );
    }

    public componentDidLoad() {
        this.loaded = true;
        this.connectedCallback();
    }

    public componentDidUpdate() {
        this.styleContainer();
    }

    public render() {
        return <slot />;
    }

    private createContainer() {
        const slot: HTMLSlotElement = this.host.shadowRoot.querySelector(
            'slot'
        );
        const content = slot.assignedElements();

        this.container = document.createElement('div');
        this.container.setAttribute('id', this.containerId);
        this.container.setAttribute('class', 'limel-portal--container');

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
        const rect: any = this.host.getBoundingClientRect();

        if (this.visible) {
            this.container.style.display = 'block';
            this.container.style.opacity = '1';
        } else {
            this.container.style.display = 'none';
            this.container.style.opacity = '0';
        }

        if (this.inheritParentWidth) {
            this.container.style.width =
                rect.width > 0
                    ? `${rect.width}px`
                    : `${this.getContentWidth(this.container)}px`;
        }

        Object.keys(this.containerStyle).forEach((property) => {
            this.container.style[property] = this.containerStyle[property];
        });
    }

    private getContentWidth(element: HTMLElement | Element) {
        if (!element) {
            return null;
        }

        const rect = element.getBoundingClientRect();
        if (rect.width !== 0) {
            return rect.width;
        }

        const elementContent = element.querySelector('*');

        return this.getContentWidth(elementContent);
    }

    private createPopperConfig(): Partial<
        OptionsGeneric<Partial<FlipModifier>>
    > {
        return {
            strategy: this.position,
            placement:
                this.openDirection === 'left' ? 'bottom-end' : 'bottom-start',
            modifiers: [
                {
                    name: 'flip',
                    options: {
                        fallbackPlacements: [
                            this.openDirection === 'left'
                                ? 'top-end'
                                : 'top-start',
                        ],
                    },
                },
            ],
        };
    }
}
