import { Component, Element, Prop, State } from '@stencil/core';

@Component({
    tag: 'limel-example',
    styleUrl: 'example.scss',
})
export class Example {
    @Prop() public name: string;

    @Element() private root: HTMLElement;

    @State() private code: string;

    public componentWillLoad() {
        const type = this.name.replace('limel-example-', '');
        const url = `/stencil/www/examples/${type}/${type}.tsx`;

        this.fetchData(url).then(data => {
            this.code = data;
        });
    }

    public componentDidUpdate() {
        const element = this.root.querySelector('.code pre');
        const prism = window['Prism']; // tslint:disable-line:no-string-literal
        prism.highlightElement(element);
    }

    public render() {
        const ExampleComponent = this.name;

        return [
            <div class="example">
                <ExampleComponent />
            </div>,
            <div class="code">
                <pre class="react-prism react-prism language-jsx">
                    <code>{this.code}</code>
                </pre>
            </div>,
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
