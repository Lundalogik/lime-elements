import { Component, Element, Prop, State } from '@stencil/core';
import prism from 'prismjs';
import 'prismjs/components/prism-jsx.js'; // tslint:disable-line:no-submodule-imports
import 'prismjs/components/prism-tsx.js'; // tslint:disable-line:no-submodule-imports

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

    public componentWillLoad() {
        const type = this.name.replace('limel-example-', '');
        const url = `/stencil/examples/${type}/${type}.tsx`;

        this.fetchData(url).then(data => {
            this.code = prism.highlight(data, prism.languages.tsx);
            const element = this.root.querySelector('.code code');
            element.innerHTML = this.code;
        });
    }

    public render() {
        const ExampleComponent = this.name;

        return [
            <div class="example">
                <ExampleComponent />
            </div>,
            <div class="code">
                <pre class="react-prism react-prism language-jsx">
                    <code />
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
