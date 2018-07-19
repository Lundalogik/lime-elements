import { Component, Prop, Element, State } from '@stencil/core';

@Component({
    tag: 'limel-example',
    styleUrl: 'example.scss',
})
export class Example {
    @Prop()
    public name: string;

    @Element()
    private root: HTMLElement;

    @State()
    private code: string;

    componentWillLoad() {   
        const type = this.name.replace('limel-example-', '');
        const url = `/stencil/www/examples/${type}/${type}.tsx`;

        this.fetchData(url).then(data => {
            this.code = data;
        });
    }

    componentDidUpdate() {    
        const element = this.root.querySelector('.code pre');
        const prism = window['Prism']; 
        prism.highlightElement(element);
    }

    public render() {
        const Example = this.name;     

        return [
            <div class="example">
                <Example />
            </div>,
            <div class="code">
                <pre class="react-prism react-prism language-jsx">
                    <code>{this.code}</code>
                </pre>
            </div>
        ];
    }

    private fetchData(url) {
        return fetch(url).then(data => {
            return data.body
                .getReader()
                .read()
                .then(({ value }) => {
                    return new TextDecoder('utf-8').decode(value);
                });
        });
    }
}
