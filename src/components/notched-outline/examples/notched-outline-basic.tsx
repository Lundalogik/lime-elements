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
    private value: string;

    public render() {
        const id = 'abcd';

        return [
            <section>
                <div>
                    <limel-notched-outline
                        labelId={id}
                        label="Label"
                        required={this.required}
                        invalid={this.invalid}
                        disabled={this.disabled}
                        readonly={this.readonly}
                    >
                        <input
                            id={id}
                            type="text"
                            required={this.required}
                            disabled={this.disabled}
                            slot="content"
                        />
                    </limel-notched-outline>
                </div>
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
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

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
