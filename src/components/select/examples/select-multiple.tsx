import { Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Select multiple values
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-multiple',
})
export class SelectMultipleExample {
    @State()
    public value: Option[] = [];

    @State()
    public disabled = false;

    @State()
    public readonly = false;

    @State()
    public required = false;

    private options: Option[] = [
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
        { text: 'Leia Organo', value: 'leia' },
    ];

    public render() {
        return (
            <section>
                <limel-select
                    label="Favorite heroes"
                    value={this.value}
                    options={this.options}
                    disabled={this.disabled}
                    readonly={this.readonly}
                    required={this.required}
                    onChange={this.handleChange}
                    multiple={true}
                />
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
                </p>
                <limel-example-value value={this.value} />
            </section>
        );
    }

    private handleChange = (event: CustomEvent<Option[]>) => {
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
}
