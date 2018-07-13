import { Component, Prop, State } from '@stencil/core';
import { examples } from '../examples.js';
import { MatchResults } from '@stencil/router';

@Component({
    tag: 'docs-root',
    styleUrl: 'docs-root.scss',
})
export class DocsRoot {
    @Prop() public match: MatchResults;

    @State() private componentToShow = 'docs-home';

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
                    <stencil-route
                        component={this.componentToShow}
                        componentProps={{componentName: this.match && this.match.params.component}}
                    />
                </main>
            </div>,
            <svg xmlns="" style="display: none">
                <symbol id="svg-icon-lime-crm-logotype" viewBox="0 0 487.1 473.3"><path d="M479.3 162.8c-32.6-113-125.6-153-177-160.5-43.2-6.6-155.6-7.2-227.6 112.3C17.8 209 58.9 285.8 59.5 348.9c-.4 28.8-4.8 63.6-44.7 90.4-39.9 26.8 13 28.8 18.3 29.1 32.6 2.1 84 6.8 142.9 4.1 51.1-2.4 139.8-1.6 219.6-66.9 39.6-32.5 116.3-116.5 83.7-242.8zm-349.2 93.3c4.8 4.9 11 7.4 18.7 7.4 11.9 0 19.9-6 23.8-18.1l22.7 5.8c-2.6 10.5-8.2 19-16.8 25.3-8.6 6.3-18.5 9.5-29.7 9.5-13.9 0-25.7-4.6-35.3-13.8-9.6-9.2-14.4-21-14.4-35.4 0-14.4 4.8-26.2 14.4-35.5 9.6-9.2 21.4-13.9 35.3-13.9 10.9 0 20.6 3.1 29.1 9.4s14.3 14.6 17.4 24.8l-23.6 6.7c-3.1-12.3-10.7-18.4-22.9-18.4-7.7 0-13.9 2.5-18.7 7.4-4.8 5-7.2 11.4-7.2 19.4.1 8.1 2.5 14.5 7.2 19.4zm137.6-42.7h-5.4c-22.1 0-33.1 13.3-33.1 39.8v30h-24.6v-92.9h24.6v16.9c8.4-12.2 19.5-18.2 33.3-18.2 2.9 0 5 .2 6.5.7l-1.3 23.7zm162.7 69.8H406v-53c0-6.1-1.7-10.9-5.2-14.6-3.5-3.7-7.8-5.5-13-5.5-6.7 0-12 2.4-15.8 7.2-3.8 4.8-5.8 11.9-5.8 21.3v44.7h-24.6v-53c0-6.1-1.7-10.9-5.2-14.6-3.5-3.7-7.8-5.5-13-5.5-6.7 0-11.9 2.4-15.6 7.1-3.7 4.7-5.6 11.8-5.6 21.4v44.7h-24.6v-92.9h24.6v7.6c7-7 16.2-10.4 27.7-10.4 13.4 0 23.6 5.1 30.5 15.3 8.2-10.2 19.5-15.3 33.9-15.3 9.9 0 18.4 3.5 25.5 10.5 7.1 7 10.6 16 10.6 27.1v57.9z"></path></symbol>
            </svg>
        ];
    }

    public componentWillLoad() {
        this.update();
    }

    public componentWillUpdate() {
        this.update();
    }

    private update() {
        this.componentToShow =
            this.match && this.match.params.component
                ? 'docs-component-wrapper'
                : 'docs-home';
    }

    private renderNavigation() {
        return examples.map(element => {
            const url = '/docs/' + element.name;
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
