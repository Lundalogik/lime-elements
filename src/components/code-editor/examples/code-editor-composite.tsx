import { Component, h, Host, State, Watch } from '@stencil/core';

/**
 * Composite Example
 */
@Component({
    tag: 'limel-example-code-editor-composite',
    shadow: true,
})
export class CodeEditorCompositeExample {
    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private readonly = false;

    @State()
    private invalid = false;

    @State()
    private value: string;

    public render() {
        return (
            <Host>
                <limel-code-editor
                    label="Write some good code"
                    helperText={
                        this.invalid
                            ? 'This code is invalid'
                            : 'The code should be in JSON format'
                    }
                    value={this.value}
                    required={this.required}
                    invalid={this.invalid}
                    disabled={this.disabled}
                    readonly={this.readonly}
                    onChange={this.handleChange}
                    language="json"
                />
                <limel-example-controls>
                    <limel-switch
                        value={this.disabled}
                        label="disabled"
                        onChange={this.setDisabled}
                    />
                    <limel-switch
                        value={this.readonly}
                        label="readonly"
                        onChange={this.setReadonly}
                    />
                    <limel-switch
                        value={this.required}
                        label="required"
                        onChange={this.setRequired}
                    />
                    <limel-switch
                        value={this.invalid}
                        label="invalid"
                        onChange={this.setInvalid}
                    />
                </limel-example-controls>
                ,
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    @Watch('required')
    @Watch('value')
    protected checkValidity() {
        this.invalid = this.required && !this.value;
    }

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

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
}
