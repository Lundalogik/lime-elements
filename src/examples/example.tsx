import { Component, h, Prop, State } from '@stencil/core';
import prism from 'prismjs';
import 'prismjs/components/prism-jsx.js'; // tslint:disable-line:no-submodule-imports
import 'prismjs/components/prism-scss.js'; // tslint:disable-line:no-submodule-imports
import 'prismjs/components/prism-tsx.js'; // tslint:disable-line:no-submodule-imports

const BASE_URL = '/';

@Component({
    tag: 'limel-example',
    styleUrl: 'example.scss',
})
export class Example {
    @Prop()
    public name: string;

    @Prop()
    public path: string;

    @State()
    private tsxCode: string;

    @State()
    private scssCode: string;

    constructor() {
        this.renderScssCode = this.renderScssCode.bind(this);
    }

    public componentWillLoad() {
        const type = this.name.replace('limel-example-', '');
        const path = this.path || type;
        const tsxUrl = `${BASE_URL}public/stencil/examples/${path}/${type}.tsx`;

        this.fetchData(tsxUrl).then(tsxData => {
            this.tsxCode = prism.highlight(tsxData, prism.languages.tsx);

            const styleUrlMatch = tsxData.match(/styleUrl: '(.*)'/);
            if (styleUrlMatch) {
                const scssUrl = `${BASE_URL}public/stencil/examples/${path}/${styleUrlMatch[1]}`;
                this.fetchData(scssUrl).then(scssData => {
                    this.scssCode = prism.highlight(
                        scssData,
                        prism.languages.scss
                    );
                });
            }
        });
    }

    public render() {
        const ExampleComponent = this.name;

        return [
            <limel-config
                config={{ iconPath: `${BASE_URL}public/stencil/` }}
            />,
            <div class="example">
                <ExampleComponent />
            </div>,
            <limel-collapsible-section header="tsx" class="code language-tsx">
                <pre class="react-prism react-prism language-tsx">
                    <code class="language-tsx" innerHTML={this.tsxCode} />
                </pre>
            </limel-collapsible-section>,
            this.renderScssCode(),
        ];
    }

    private renderScssCode() {
        return this.scssCode ? (
            <limel-collapsible-section header="scss" class="code language-scss">
                <pre class="react-prism react-prism language-scss">
                    <code class="language-scss" innerHTML={this.scssCode} />
                </pre>
            </limel-collapsible-section>
        ) : (
            ''
        );
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
