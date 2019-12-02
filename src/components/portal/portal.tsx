import { Component, Element, h, Prop } from '@stencil/core';

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
        this.container.setAttribute('id', this.containerId);
        content.forEach(element => {
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

    private styleContainer() {
        if (!this.container) {
            return;
        }

        const rect: any = this.host.getBoundingClientRect();
        const [x, y] = this.getPosition(rect);
        const viewportHeight = this.getViewportHeight();
        const containerHeight = viewportHeight - rect.y;

        this.container.style.position = 'absolute';
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;
        this.container.style.width = `${rect.width}px`;
        this.container.style.height = `${containerHeight}px`;
        this.container.style.display = 'block';
        if (!this.visible) {
            this.container.style.display = 'none';
        }

        Object.keys(this.containerStyle).forEach(property => {
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
}
