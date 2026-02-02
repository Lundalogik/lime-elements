import { Component, h, State, Host } from '@stencil/core';
import { data } from '../../table/examples/birds';

/**
 * Copy Button
 * The copy button of the code editor appears on hover and focus, when the editor contains content and is
 * in any state other than disabled. The appearance of the button can be configured via the `copyButton` property.
 */

@Component({
    tag: 'limel-example-code-editor-copy',
    shadow: true,
    styleUrl: 'code-editor.scss',
})
export class CodeExampleCopy {
    @State()
    private json: string = JSON.stringify(data, null, '    ');

    @State()
    private showCopyButton = true;

    public render() {
        return (
            <Host>
                <limel-code-editor
                    value={this.json}
                    language="json"
                    showCopyButton={this.showCopyButton}
                    onChange={this.handleChange}
                />

                <limel-example-controls>
                    <limel-switch
                        value={this.showCopyButton}
                        label="showCopyButton"
                        onChange={this.toggleCopyButton}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<string>) => {
        this.json = event.detail;
    };

    private toggleCopyButton = (event: CustomEvent<boolean>) => {
        this.showCopyButton = event.detail;
    };
}
