import { Component, Element, State } from '@stencil/core';
import '@stencil/router';
import { examples } from '../examples.js';

@Component({
    styleUrl: 'app.scss',
    tag: 'limel-example-app',
})
export class ExampleApp {
    @State() public docs = '';
    @State() public code = '';

    @Element() private root: HTMLElement;

    public render() {
        return [
            <header class="mdc-top-app-bar mdc-top-app-bar--fixed">
                <div class="mdc-top-app-bar__row">
                    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                        <a href="/" class="mdc-top-app-bar__navigation-icon">
                            <svg>
                                <use href="#svg-icon-lime-crm-logotype" />
                            </svg>
                        </a>
                        <span class="mdc-top-app-bar__title">
                            Lime Elements
                        </span>
                    </section>
                </div>
            </header>,
            <div class="content mdc-top-app-bar--fixed-adjust">
                <nav class="mdc-drawer mdc-drawer--permanent mdc-typography">
                    <nav id="icon-with-text-demo" class="mdc-list">
                        {this.renderNavigation()}
                    </nav>
                </nav>
                <main>{this.renderContent()}</main>
            </div>,
        ];
    }

    public renderNavigation() {
        return examples.map(element => {
            const url = '/' + element.name;
            const title = element.title;

            return (
                <stencil-route-link
                    class="mdc-list-item"
                    activeClass="mdc-list-item--activated"
                    url={url}
                >
                    {title}
                </stencil-route-link>
            );
        });
    }

    public renderContent() {
        let routes = examples.map(element => {
            const Component = element.name.replace('limel-', 'limel-example-'); // tslint:disable-line:no-shadowed-variable
            const url = '/' + element.name;

            return (
                <stencil-route
                    url={url}
                    routeRender={() => {
                        this.renderCode(url);

                        return (
                            <div class="example-content">
                                <div class="docs">{this.renderDoc(url)}</div>

                                <div class="example">
                                    <h2>Example</h2>
                                    <Component />
                                </div>

                                <div class="code">
                                    <h2>Source</h2>
                                    <div id="codeMirror-container" />
                                </div>
                            </div>
                        );
                    }}
                />
            );
        });

        routes = [
            <stencil-route
                url="/"
                component="limel-example-doc"
                exact={true}
            />,
            ...routes,
        ];

        return <stencil-router>{routes}</stencil-router>;
    }

    public renderDoc = url => {
        const type = url.replace('limel-', '');
        this.fetchData(`/components/${type}/readme.md`).then(data => {
            const element = this.root.querySelector('#docs');
            element.innerHTML = window['marked'](data); // tslint:disable-line:no-string-literal
            this.docs = data;
        });

        return <div id="docs">{this.docs}</div>;
    };

    public renderCode = url => {
        const type = url.replace('limel-', '');
        this.fetchData(`/examples/${type}/${type}.tsx`).then(data => {
            const element = this.root.querySelector('#codeMirror-container');
            element.innerHTML = '';
            const codeMirror = window['CodeMirror'](element, { // tslint:disable-line:no-string-literal prettier
                lineNumbers: true,
                mode: 'javascript',
                readOnly: true,
                theme: 'solarized',
            });
            codeMirror.setValue(data);
        });

        return;
    };

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
