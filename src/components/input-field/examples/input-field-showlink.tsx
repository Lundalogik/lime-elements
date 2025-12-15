import { Component, h, State } from '@stencil/core';

/**
 * With `showLink=true`
 */
@Component({
    tag: 'limel-example-input-field-showlink',
    shadow: true,
    styleUrl: 'show-link.scss',
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
                onChange={this.handleEmailChange}
                type="email"
                showLink
            />,
            <limel-input-field
                label="Phone Field"
                value={this.telValue}
                required={this.required}
                disabled={this.disabled}
                readonly={this.readonly}
                onChange={this.handleTelChange}
                type="tel"
                showLink
            />,
            <limel-input-field
                label="URL Field"
                value={this.urlValue}
                required={this.required}
                disabled={this.disabled}
                readonly={this.readonly}
                onChange={this.handleUrlChange}
                type="url"
                showLink
            />,
            <limel-input-field
                label="urlAsText"
                value={this.urlValue}
                required={this.required}
                disabled={this.disabled}
                readonly={this.readonly}
                onChange={this.handleUrlChange}
                type="urlAsText"
                showLink
            />,
            <limel-example-controls>
                <limel-switch
                    value={this.disabled}
                    label="Disabled"
                    onChange={this.setDisabled}
                />
                <limel-switch
                    value={this.readonly}
                    label="Readonly"
                    onChange={this.setReadonly}
                />
                <limel-switch
                    value={this.required}
                    label="Required"
                    onChange={this.setRequired}
                />
            </limel-example-controls>,
            <limel-example-value value={this.emailValue} />,
            <limel-example-value value={this.telValue} />,
            <limel-example-value value={this.urlValue} />,
        ];
    }

    private handleEmailChange = (event: CustomEvent<string>) => {
        this.emailValue = event.detail;
    };

    private handleTelChange = (event: CustomEvent<string>) => {
        this.telValue = event.detail;
    };

    private handleUrlChange = (event: CustomEvent<string>) => {
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
