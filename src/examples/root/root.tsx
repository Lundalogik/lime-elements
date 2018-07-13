import { Component } from '@stencil/core';
import { examples } from '../examples.js';

@Component({
    tag: 'docs-root',
    styleUrl: 'root.scss',
})
export class Root {
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
                            Lime Elements Documentation
                        </span>
                    </section>
                </div>
            </header>,
            <div class="content mdc-top-app-bar--fixed-adjust">
                <nav class="mdc-drawer mdc-drawer--permanent mdc-typography">
                    <nav class="mdc-list">{this.renderNavigation()}</nav>
                </nav>
                <main>
                    <stencil-router>
                        <stencil-route-switch scrollTopOffset={0}>
                            <stencil-route
                                url="/"
                                component="docs-home"
                                exact={true}
                            />
                            <stencil-route
                                url="/:component"
                                component="docs-component-wrapper"
                            />
                        </stencil-route-switch>
                    </stencil-router>
                </main>
            </div>,
        ];
    }

    private renderNavigation() {
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
}
