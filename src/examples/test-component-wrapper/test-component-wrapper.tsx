import { Component, Prop } from '@stencil/core';
import { MatchResults } from '@stencil/router';

@Component({ tag: 'test-component-wrapper' })
export class TestComponentWrapper {
    @Prop() public match: MatchResults;

    public render() {
        if (this.match && this.match.params.component) {
            return (
                <stencil-route
                    component={'docs-' + this.match.params.component}
                />
            );
        }
    }
}
