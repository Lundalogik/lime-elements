import { Component, h, State } from '@stencil/core';

/**
 * Basic example
 *
 * Notice that the wrapping div has a hardcoded height,
 * which results in the notched outline to wrap around
 * the div.
 */
@Component({
    tag: 'limel-example-notched-outline-basic',
    shadow: true,
    styleUrl: 'notched-outline-basic.scss',
})
export class NotchedOutlineBasicExample {
    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private readonly = false;

    @State()
    private invalid = false;

    @State()
    private hasValue = false;

    @State()
    private hasLeadingIcon = false;

    @State()
    private hasFloatingLabel = false;

    @State()
    private inputValue: string;

    public render() {
        const id = 'abcd';

        return [
            <section>
                <limel-notched-outline
                    labelId={id}
                    label="Label"
                    required={this.required}
                    invalid={this.invalid}
                    disabled={this.disabled}
                    readonly={this.readonly}
                    hasValue={this.hasValue}
                    hasLeadingIcon={this.hasLeadingIcon}
                    hasFloatingLabel={this.hasFloatingLabel}
                >
                    <input
                        slot="content"
                        id={id}
                        type="text"
                        required={this.required}
                        disabled={this.disabled}
                        readonly={this.readonly}
                        value={this.inputValue}
                        onInput={this.handleInput}
                    />
                </limel-notched-outline>
            </section>,
            <limel-example-controls>
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
                <limel-checkbox
                    checked={this.invalid}
                    label="Invalid"
                    onChange={this.setInvalid}
                />
                <hr
                    style={{
                        gridColumn: '1/-1',
                    }}
                />
                <limel-checkbox
                    checked={this.hasValue}
                    label="Has value"
                    onChange={this.setHasValue}
                />
                <limel-checkbox
                    checked={this.hasLeadingIcon}
                    label="Has leading icon"
                    onChange={this.setHasLeadingIcon}
                />
                <limel-checkbox
                    checked={this.hasFloatingLabel}
                    label="Has floating label"
                    onChange={this.setHasFloatingLabel}
                />
            </limel-example-controls>,
            <limel-example-value value={this.hasValue} />,
        ];
    }

    private handleInput = (event: Event) => {
        const input = event.target as HTMLInputElement;
        this.inputValue = input.value;
        this.hasValue = !!input.value;
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

    private setHasValue = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.hasValue = event.detail;
    };

    private setHasLeadingIcon = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.hasLeadingIcon = event.detail;
    };

    private setHasFloatingLabel = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.hasFloatingLabel = event.detail;
    };
}
