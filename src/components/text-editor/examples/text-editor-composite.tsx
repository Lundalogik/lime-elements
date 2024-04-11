import {
    LimelInputFieldCustomEvent,
    LimelTextEditorCustomEvent,
} from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
/**
 * Composite example
 */
@Component({
    tag: 'limel-example-text-editor-composite',
    shadow: true,
    styleUrl: 'text-editor-composite.scss',
})
export class BasicTextEditorCompositeExample {
    @State()
    private text: { html: string } = { html: '' };

    @State()
    private label: string;

    public render() {
        return [
            <limel-text-editor
                label={this.label}
                onChange={this.handleChange}
            />,
            <limel-example-controls>
                <limel-input-field
                    label="Label"
                    value={this.label}
                    onChange={this.handleLabelChange}
                />
            </limel-example-controls>,
            <hr />,
            <limel-example-value value={this.text} />,
        ];
    }

    private handleChange = (
        event: LimelTextEditorCustomEvent<{ html: string }>,
    ): void => {
        event.stopPropagation();
        this.text = event.detail;
    };

    private handleLabelChange = (event: LimelInputFieldCustomEvent<string>) => {
        event.stopPropagation();
        this.label = event.detail;
    };
}
