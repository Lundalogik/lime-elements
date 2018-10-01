import { Component, Element, Prop, State } from '@stencil/core';
import prism from 'prismjs';
import 'prismjs/components/prism-jsx.js'; // tslint:disable-line:no-submodule-imports
import 'prismjs/components/prism-scss.js'; // tslint:disable-line:no-submodule-imports
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
    private tsxCode: string;

    @State()
    private scssCode: string;

    public componentWillLoad() {
        const type = this.name.replace('limel-example-', '');
        const tsxUrl = `/stencil/examples/${type}/${type}.tsx`;
        const scssUrl = `/stencil/examples/${type}/${type}.scss`;

        this.fetchData(tsxUrl).then(data => {
            this.tsxCode = prism.highlight(data, prism.languages.tsx);
            const element = this.root.querySelector('.code.language-tsx code');
            element.innerHTML = this.tsxCode;
        });

        this.fetchData(scssUrl).then(data => {
            if (data !== 'Not Found') {
                this.scssCode = prism.highlight(data, prism.languages.scss);
                const element = this.root.querySelector(
                    '.code.language-scss code'
                );
                element.innerHTML = this.scssCode;
            }
        });
    }

    public render() {
        const ExampleComponent = this.name;

        return [
            <div class="example">
                <ExampleComponent />
            </div>,
            <div class="code language-tsx">
                <pre class="react-prism react-prism language-tsx">
                    <code />
                </pre>
            </div>,
            <div
                class={`
                    code
                    language-scss
                    ${this.scssCode ? '' : 'hidden'}
                `}
            >
                <pre class="react-prism react-prism language-scss">
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
