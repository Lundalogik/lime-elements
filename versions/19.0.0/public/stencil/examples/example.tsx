import { Component, Element, Prop, State } from '@stencil/core';
import prism from 'prismjs';
import 'prismjs/components/prism-jsx.js'; // tslint:disable-line:no-submodule-imports
import 'prismjs/components/prism-scss.js'; // tslint:disable-line:no-submodule-imports
import 'prismjs/components/prism-tsx.js'; // tslint:disable-line:no-submodule-imports

const BASE_URL = '/lime-elements/versions/19.0.0/';

@Component({
    tag: 'limel-example',
    styleUrl: 'example.scss',
})
export class Example {
    @Prop()
    public name: string;

    @Prop()
    public path: string;

    @Element()
    private root: HTMLElement;

    @State()
    private tsxCode: string;

    @State()
    private scssCode: string;

    public componentWillLoad() {
        const type = this.name.replace('limel-example-', '');
        const path = this.path || type;
        const tsxUrl = `${BASE_URL}stencil/examples/${path}/${type}.tsx`;
        const scssUrl = `${BASE_URL}stencil/examples/${path}/${type}.scss`;

        this.fetchData(tsxUrl).then(data => {
            this.tsxCode = prism.highlight(data, prism.languages.tsx);
            const element = this.root.querySelector('.code.language-tsx code');
            element.innerHTML = this.tsxCode;
        });
        // Fetching the tsx source should not give us 404s, so no `catch` here.

        this.fetchData(scssUrl)
            .then(data => {
                this.scssCode = prism.highlight(data, prism.languages.scss);
                const element = this.root.querySelector(
                    '.code.language-scss code'
                );
                element.innerHTML = this.scssCode;
            })
            .catch(error => {
                // 404s are ok, other errors are not.
                if (error.message !== '404') {
                    throw error;
                }
            });
    }

    public render() {
        const ExampleComponent = this.name;

        return [
            <limel-config config={{ iconPath: `${BASE_URL}stencil/` }} />,
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
            if (data.status === 404) { // tslint:disable-line:no-magic-numbers prettier
                throw new Error('404');
            }
            return data.body
                .getReader()
                .read()
                .then(({ value }) => {
                    return new TextDecoder('utf-8').decode(value);
                });
        });
    }
}
