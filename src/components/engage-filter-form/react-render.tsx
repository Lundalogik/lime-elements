import { h, Element, Prop, Component, Watch } from '@stencil/core';
import { render, unmountComponentAtNode } from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';

const CLASS_NAME = 'react-render-slot';

@Component({
    tag: 'react-render',
    shadow: true,
    styleUrl: 'engage-filter-form.scss',
})
export class ReactRender {
    @Prop()
    public content: any;

    @Watch('content')
    public rerenderReact() {
        this.reactRender();
        // retargetEvents(this.host.shadowRoot);
    }

    @Element()
    protected host: HTMLElement;

    protected componentDidLoad() {
        this.reactRender();
        // retargetEvents(this.host.shadowRoot);
    }

    protected componentDidUnmount() {
        unmountComponentAtNode(this.getElement());
    }

    render() {
        return <div class={CLASS_NAME} />;
    }

    private reactRender() {
        render(this.content, this.getElement());
    }

    private getElement() {
        return this.host.shadowRoot.querySelector('.' + CLASS_NAME);
    }
}
