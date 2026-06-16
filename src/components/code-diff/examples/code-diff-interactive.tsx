import {
    CodeDiffLayout,
    LimelSelectCustomEvent,
    Option,
} from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

const INITIAL_OLD_VALUE = `{
    "name": "acme-dashboard",
    "version": "1.4.0",
    "private": true,
    "scripts": {
        "build": "vite build",
        "test": "vitest"
    },
    "dependencies": {
        "react": "18.2.0",
        "lodash": "4.17.21"
    }
}`;

const INITIAL_NEW_VALUE = `{
    "name": "acme-dashboard",
    "version": "2.0.0",
    "private": true,
    "scripts": {
        "build": "vite build --mode production",
        "test": "vitest",
        "lint": "eslint ."
    },
    "dependencies": {
        "react": "18.2.0",
        "zustand": "4.5.0"
    }
}`;

const LAYOUT_OPTIONS: Array<Option<CodeDiffLayout>> = [
    { text: 'unified', value: 'unified' },
    { text: 'split', value: 'split' },
];

/**
 * Interactive playground
 *
 * Edit either side and watch the diff update live. Use the controls
 * to switch between `unified` and `split` layouts, and to toggle
 * `lineWrapping` on and off.
 */
@Component({
    tag: 'limel-example-code-diff-interactive',
    shadow: true,
    styleUrl: 'code-diff-interactive.scss',
})
export class CodeDiffInteractiveExample {
    @State()
    private oldValue: string = INITIAL_OLD_VALUE;

    @State()
    private newValue: string = INITIAL_NEW_VALUE;

    @State()
    private layout: Option<CodeDiffLayout> = LAYOUT_OPTIONS[1];

    @State()
    private lineWrapping = true;

    public render() {
        return (
            <Host>
                <div class="editors">
                    <limel-code-editor
                        label="Old value"
                        language="json"
                        lineNumbers={true}
                        value={this.oldValue}
                        onChange={this.handleOldValueChange}
                    />
                    <limel-code-editor
                        label="New value"
                        language="json"
                        lineNumbers={true}
                        value={this.newValue}
                        onChange={this.handleNewValueChange}
                    />
                </div>
                <limel-example-controls style={{ margin: '1rem 0' }}>
                    <limel-select
                        label="layout"
                        options={LAYOUT_OPTIONS}
                        value={this.layout}
                        onChange={this.handleLayoutChange}
                    />
                    <limel-switch
                        label="lineWrapping"
                        value={this.lineWrapping}
                        onChange={this.handleLineWrappingChange}
                    />
                </limel-example-controls>
                <limel-code-diff
                    oldValue={this.oldValue}
                    newValue={this.newValue}
                    language="json"
                    layout={this.layout.value}
                    lineWrapping={this.lineWrapping}
                />
            </Host>
        );
    }

    private readonly handleOldValueChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.oldValue = event.detail;
    };

    private readonly handleNewValueChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.newValue = event.detail;
    };

    private readonly handleLayoutChange = (
        event: LimelSelectCustomEvent<Option<CodeDiffLayout>>
    ) => {
        event.stopPropagation();
        this.layout = event.detail;
    };

    private readonly handleLineWrappingChange = (
        event: CustomEvent<boolean>
    ) => {
        event.stopPropagation();
        this.lineWrapping = event.detail;
    };
}
