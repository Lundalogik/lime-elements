import { Component } from '@stencil/core';
import '@stencil/router'

@Component({
    tag: 'app-root'
})
export class Root {
    public render() {
        return (
            <stencil-router>
                <stencil-route-switch scrollTopOffset={0}>
                    <stencil-route
                        url={['/', '/docs', '/docs/']}
                        component="docs-root"
                        exact={true}
                    />
                    <stencil-route
                        url="/docs/:component"
                        component="docs-root"
                    />
                    <stencil-route
                        url="/test/:component"
                        component="test-component-wrapper"
                    />
                </stencil-route-switch>
            </stencil-router>
        );
    }
}
