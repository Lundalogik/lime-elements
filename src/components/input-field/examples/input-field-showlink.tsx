import { Component, h, State, Watch } from '@stencil/core';

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
    private emailInvalid = false;

    @State()
    private telInvalid = false;

    @State()
    private urlInvalid = false;

    @State()
    private emailValue: string;

    @State()
    private telValue: string;

    @State()
    private urlValue: string;

    constructor() {
        this.checkValidity = this.checkValidity.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.telChangeHandler = this.telChangeHandler.bind(this);
        this.urlChangeHandler = this.urlChangeHandler.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.toggleRequired = this.toggleRequired.bind(this);
    }

    public render() {
        return [
            <limel-input-field
                label="Email Field"
                value={this.emailValue}
                required={this.required}
                invalid={this.emailInvalid}
                disabled={this.disabled}
                onChange={this.emailChangeHandler}
                type="email"
                showLink
            />,
            <limel-input-field
                label="Phone Field"
                value={this.telValue}
                required={this.required}
                invalid={this.telInvalid}
                disabled={this.disabled}
                onChange={this.telChangeHandler}
                type="tel"
                showLink
            />,
            <limel-input-field
                label="URL Field"
                value={this.urlValue}
                required={this.required}
                invalid={this.urlInvalid}
                disabled={this.disabled}
                onChange={this.urlChangeHandler}
                type="url"
                showLink
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-button
                        onClick={this.toggleEnabled}
                        label={this.disabled ? 'Enable' : 'Disable'}
                    />
                    <limel-button
                        onClick={this.toggleRequired}
                        label={this.required ? 'Set Optional' : 'Set Required'}
                    />
                </limel-flex-container>
            </p>,
            <limel-example-value value={this.emailValue} />,
            <limel-example-value value={this.telValue} />,
            <limel-example-value value={this.urlValue} />,
        ];
    }

    @Watch('required')
    private checkValidity() {
        this.emailInvalid = this.required && !this.emailValue;
        this.telInvalid = this.required && !this.telValue;
        this.urlInvalid = this.required && !this.urlValue;
    }

    private emailChangeHandler(event: CustomEvent<string>) {
        this.emailValue = event.detail;
        this.checkValidity();
    }

    private telChangeHandler(event: CustomEvent<string>) {
        this.telValue = event.detail;
        this.checkValidity();
    }

    private urlChangeHandler(event: CustomEvent<string>) {
        this.urlValue = event.detail;
        this.checkValidity();
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }

    private toggleRequired() {
        this.required = !this.required;
    }
}
