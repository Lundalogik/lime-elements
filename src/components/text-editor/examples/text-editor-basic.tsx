import {
    LimelCheckboxCustomEvent,
    LimelInputFieldCustomEvent,
    LimelTextEditorCustomEvent,
} from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
/**
 * A basic example
 *
 * Try typing and editing text, or copy & paste in some rendered HTML code
 * from your browser into the editor to see how it is rendered and what you get
 * as an output value.
 */
@Component({
    tag: 'limel-example-text-editor-basic',
    shadow: true,
})
export class BasicTextEditorBasicExample {
    @State()
    private text: { html: string } = { html: '' };

    @State()
    private disabled: boolean;

    @State()
    private placeholder: string;

    @State()
    private readonly: boolean;

    public render() {
        return [
            <limel-example-controls>
                <limel-input-field
                    label="Placeholder"
                    value={this.placeholder}
                    onChange={this.handlePlaceholderChange}
                />
                <limel-checkbox
                    label="readonly"
                    checked={this.readonly}
                    onChange={this.handleChangeReadonly}
                />
                <limel-checkbox
                    label="disabled"
                    checked={this.disabled}
                    onChange={this.handleChangeDisabled}
                />
            </limel-example-controls>,
            <limel-text-editor
                onChange={this.handleChange}
                placeholder={this.placeholder}
                readonly={this.readonly}
                disabled={this.disabled}
            />,
            <hr />,
            <h2>Preview using limel-markdown:</h2>,
            <limel-markdown value={this.text.html} />,
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

    private handleChangeDisabled = (
        event: LimelCheckboxCustomEvent<boolean>,
    ) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private handlePlaceholderChange = (
        event: LimelInputFieldCustomEvent<string>,
    ) => {
        event.stopPropagation();
        this.placeholder = event.detail;
    };

    private handleChangeReadonly = (
        event: LimelCheckboxCustomEvent<boolean>,
    ) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };
}
