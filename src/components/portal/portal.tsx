import { Component, Element, h, Prop, Watch } from '@stencil/core';
import { OpenDirection } from '../menu/menu.types';

/**
 * The portal component provides a way to render children into a DOM node that exist outside
 * the DOM hierarchy of the parent component.
 *
 * There are some caveats when using this component
 *
 * * Events might not bubble up as expected since the content is moved out to another DOM node
 * * Any styling that is applied to content from the parent will be lost, if the content is
 *   just another web compoent it will work without any issues
 * * When the node is moved in the DOM, `componentDidUnload`, `disconnectedCallback` and `connectedCallback`
 *   will be invoked, so `componentDidUnload` can not be used as a destructor (which is the wrong behavior anyway)
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
     * True if the content within the portal should be visible
     *
     * If the content is from within a dialog for instance, this can be set to
     * true from false when the dialog opens to position the content properly
     */
    @Prop()
    public visible = false;

    /**
     * Decides which direction the portal content should open. Defaults to right.
     */
    @Prop()
    public openDirection: OpenDirection = 'right';

    private width: number;

    @Watch('visible')
    protected onVisible() {
        if (this.visible) {
            setTimeout(() => {
                this.width = this.getContentWidth(this.container);
                this.styleContainer();
                this.showContainer();
            });
        }
    }

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

    @Element()
    private host: HTMLElement;

    private container: HTMLElement;

    public connectedCallback() {
        this.attachContainer();
        this.styleContainer();
    }

    public disconnectedCallback() {
        this.removeContainer();
    }

    public componentDidLoad() {
        this.createContainer();
        this.attachContainer();
        this.styleContainer();
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
        this.hideContainer();
        this.container.setAttribute('id', this.containerId);
        content.forEach((element: HTMLElement) => {
            this.container.appendChild(element);
        });
    }

    private attachContainer() {
        if (!this.container) {
            return;
        }

        this.parent.appendChild(this.container);
    }

    private removeContainer() {
        this.container.parentElement.removeChild(this.container);
    }

    private hideContainer() {
        this.container.style.opacity = '0';
    }

    private showContainer() {
        this.container.style.opacity = '1';
    }

    private styleContainer() {
        if (!this.container) {
            return;
        }

        const rect: any = this.host.getBoundingClientRect();
        const [x, y] = this.getPosition(rect);
        const viewportHeight = this.getViewportHeight();
        const containerHeight = viewportHeight - rect.y;

        this.container.style.position = 'absolute';

        const leftX = this.openDirection === 'right' ? x : x - this.width;
        this.container.style.left = `${leftX}px`;

        this.container.style.top = `${y}px`;
        this.container.style.width =
            rect.width > 0 ? `${rect.width}px` : `${this.width}px`;
        this.container.style.height = `${containerHeight}px`;
        this.container.style.display = 'block';
        if (!this.visible) {
            this.container.style.display = 'none';
        }

        Object.keys(this.containerStyle).forEach((property) => {
            this.container.style[property] = this.containerStyle[property];
        });
    }

    private getPosition(rect: DOMRect) {
        let x = rect.x;
        let y = rect.y;

        let element: HTMLElement = this.container.parentElement;
        while (element) {
            x += element.scrollLeft;
            y += element.scrollTop;
            element = element.parentElement;
        }

        return [x, y];
    }

    private getViewportHeight() {
        return Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
        );
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
}
