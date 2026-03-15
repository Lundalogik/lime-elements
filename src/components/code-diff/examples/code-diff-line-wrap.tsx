import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { Component, Host, State, h } from '@stencil/core';

const OLD_VALUE = `{
    "name": "my-application",
    "description": "A short description of the application that fits on one line.",
    "apiEndpoint": "https://api.example.com/v1/resources",
    "connectionString": "Server=db.example.com;Database=mydb;User Id=demo-user;Authentication=ManagedIdentity;Timeout=30;MultipleActiveResultSets=true;TrustServerCertificate=true;Encrypt=true",
    "featureFlags": {
        "enableNewDashboard": false,
        "maxRetries": 3
    }
}`;

const NEW_VALUE = `{
    "name": "my-application",
    "description": "A much longer description of the application that has been expanded to include details about its purpose, target audience, and key features — demonstrating how line wrapping handles long text.",
    "apiEndpoint": "https://api.example.com/v2/resources?include=metadata&expand=relations&fields=id,name,status,createdAt,updatedAt",
    "connectionString": "Server=db.example.com;Database=mydb;User Id=demo-user;Authentication=ManagedIdentity;Timeout=60;MultipleActiveResultSets=true;TrustServerCertificate=true;Encrypt=true;ApplicationIntent=ReadWrite",
    "featureFlags": {
        "enableNewDashboard": true,
        "maxRetries": 5,
        "betaUsers": ["alice@example.com", "bob@example.com"]
    }
}`;

const LAYOUT_OPTIONS: Array<Option<'unified' | 'split'>> = [
    { text: 'unified', value: 'unified' },
    { text: 'split', value: 'split' },
];

/**
 * Line wrapping
 *
 * Set `lineWrapping` to `true` to wrap long lines instead of scrolling
 * horizontally. This is useful for config files, prose, or any content
 * with long values.
 *
 * Toggle the split view to see how wrapping behaves in each mode.
 */
@Component({
    tag: 'limel-example-code-diff-line-wrap',
    shadow: true,
    styleUrl: 'code-diff-basic.scss',
})
export class CodeDiffLineWrappingExample {
    @State()
    private lineWrapping = false;

    @State()
    private layout: Option<'unified' | 'split'> = LAYOUT_OPTIONS[0];

    public render() {
        return (
            <Host>
                <limel-example-controls style={{ margin: '0 0 1rem 0' }}>
                    <limel-switch
                        label="lineWrapping"
                        value={this.lineWrapping}
                        onChange={this.handleLineWrappingChange}
                    />
                    <limel-select
                        label="layout"
                        options={LAYOUT_OPTIONS}
                        value={this.layout}
                        onChange={this.handleLayoutChange}
                    />
                </limel-example-controls>
                <div>
                    <limel-code-diff
                        oldValue={OLD_VALUE}
                        newValue={NEW_VALUE}
                        layout={this.layout.value}
                        lineWrapping={this.lineWrapping}
                    />
                </div>
            </Host>
        );
    }

    private readonly handleLineWrappingChange = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.lineWrapping = event.detail;
    };

    private readonly handleLayoutChange = (
        event: LimelSelectCustomEvent<Option<'unified' | 'split'>>
    ) => {
        event.stopPropagation();
        this.layout = event.detail;
    };
}
