import { Component, Prop, State } from '@stencil/core';
import { MatchResults } from '@stencil/router';

@Component({
    tag: 'docs-component-wrapper',
    styleUrl: 'component-wrapper.scss',
})
export class ComponentWrapper {
    @Prop() public match: MatchResults;

    @State() private componentName = '';
    @State() private docs = '';
    @State() private code = '';

    public render() {
        if (this.componentName) {
            return (
                <div class="example-content">
                    <div id="docs" innerHTML={this.docs} />

                    <div class="example">
                        <h2>Example</h2>
                        <stencil-route
                            component={'docs-' + this.componentName}
                        />
                    </div>

                    <div class="code">
                        <h2>Source</h2>
                        <pre class="language-tsx">
                            <code class="language-tsx" innerHTML={this.code} />
                        </pre>
                    </div>
                </div>
            );
        }
    }

    public componentWillLoad() {
        this.update();
    }

    public componentWillUpdate() {
        this.update();
    }

    private update() {
        this.componentName =
            this.match && this.match.params.component
                ? this.match.params.component
                : '';
        this.loadDocumentation();
        this.loadCode();
    }

    private loadDocumentation() {
        const noPrefix = this.componentName.replace('limel-', '');
        this.fetchData(`/components/${noPrefix}/readme.md`).then(data => {
            this.docs = window['marked'](data); // tslint:disable-line:no-string-literal
        });
    }

    private loadCode() {
        if (this.match && this.match.params.component) {
            const noPrefix = this.componentName.replace('limel-', '');
            this.fetchData(`/examples/${noPrefix}/${noPrefix}.tsx`).then(
                data => {
                    const prism = window['Prism']; // tslint:disable-line:no-string-literal
                    this.code = prism.highlight(data, prism.languages.tsx);
                }
            );
        }
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
