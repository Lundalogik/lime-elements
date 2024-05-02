import { Component, h, State, Watch } from '@stencil/core';
/**
 * Composite example
 */
@Component({
    tag: 'limel-example-text-editor-composite',
    shadow: true,
})
export class TextEditorCompositeExample {
    @State()
    private value: string = 'Hello, world!';

    @State()
    private readonly = false;

    @State()
    private invalid = false;

    @State()
    private required = false;

    @State()
    private label: string;

    @State()
    private placeholder: string;

    @State()
    private helperText: string;

    public render() {
        return [
            <limel-text-editor
                label={this.label}
                helperText={this.helperText}
                value={this.value}
                onChange={this.handleChange}
                readonly={this.readonly}
                required={this.required}
                invalid={this.invalid}
                placeholder={this.placeholder}
            />,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.readonly}
                    label="Readonly"
                    onChange={this.setReadonly}
                />
                <limel-checkbox
                    checked={this.invalid}
                    label="Invalid"
                    onChange={this.setInvalid}
                />
                <limel-checkbox
                    checked={this.required}
                    label="Required"
                    onChange={this.setRequired}
                />
                <hr
                    style={{
                        'grid-column': '1/-1',
                    }}
                />
                <limel-input-field
                    label="label"
                    value={this.label}
                    onChange={this.handleLabelChange}
                />
                <limel-input-field
                    label="helperText"
                    value={this.helperText}
                    onChange={this.handleHelperTextChange}
                />
                <limel-input-field
                    label="placeholder"
                    value={this.placeholder}
                    onChange={this.handlePlaceholderChange}
                />
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

    @Watch('required')
    @Watch('value')
    protected checkValidity() {
        this.invalid = this.required && !this.value;
    }

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };

    private setRequired = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.required = event.detail;
    };

    private setInvalid = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.invalid = event.detail;
    };

    private handleLabelChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.label = event.detail;
    };

    private handleHelperTextChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.helperText = event.detail;
    };

    private handlePlaceholderChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.placeholder = event.detail;
    };

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };
}
