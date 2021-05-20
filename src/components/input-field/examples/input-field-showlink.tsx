import { Component, h, State } from '@stencil/core';

/**
 * With `showLink=true`
 */
@Component({
    tag: 'limel-example-input-field-showlink',
    shadow: true,
    styleUrl: 'input-field.scss',
})
export class InputFieldShowlinkExample {
    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private readonly = false;

    @State()
    private emailValue: string;

    @State()
    private telValue: string;

    @State()
    private urlValue: string;

    public render() {
        return [
            <limel-input-field
                label="Email Field"
                value={this.emailValue}
                required={this.required}
                disabled={this.disabled}
                readonly={this.readonly}
                onChange={this.emailChangeHandler}
                type="email"
                showLink
            />,
            <limel-input-field
                label="Phone Field"
                value={this.telValue}
                required={this.required}
                disabled={this.disabled}
                readonly={this.readonly}
                onChange={this.telChangeHandler}
                type="tel"
                showLink
            />,
            <limel-input-field
                label="URL Field"
                value={this.urlValue}
                required={this.required}
                disabled={this.disabled}
                readonly={this.readonly}
                onChange={this.urlChangeHandler}
                type="url"
                showLink
            />,
            <limel-input-field
                label="urlAsText"
                value={this.urlValue}
                required={this.required}
                disabled={this.disabled}
                readonly={this.readonly}
                onChange={this.urlChangeHandler}
                type="urlAsText"
                showLink
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-checkbox
                        checked={this.disabled}
                        label="Disabled"
                        onChange={this.setDisabled}
                    />
                    <limel-checkbox
                        checked={this.readonly}
                        label="Readonly"
                        onChange={this.setReadonly}
                    />
                    <limel-checkbox
                        checked={this.required}
                        label="Required"
                        onChange={this.setRequired}
                    />
                </limel-flex-container>
            </p>,
            <limel-example-value value={this.emailValue} />,
            <limel-example-value value={this.telValue} />,
            <limel-example-value value={this.urlValue} />,
        ];
    }

    private emailChangeHandler = (event: CustomEvent<string>) => {
        this.emailValue = event.detail;
    };

    private telChangeHandler = (event: CustomEvent<string>) => {
        this.telValue = event.detail;
    };

    private urlChangeHandler = (event: CustomEvent<string>) => {
        this.urlValue = event.detail;
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
}
