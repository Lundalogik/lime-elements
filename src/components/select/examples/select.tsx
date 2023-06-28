import { Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

@Component({
    shadow: true,
    tag: 'limel-example-select',
})
export class SelectExample {
    @State()
    public value: Option;

    @State()
    public disabled = false;

    @State()
    public readonly = false;

    @State()
    public required = false;

    @State()
    public invalid = false;

    private options: Option[] = [
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han', disabled: true },
        { text: 'Leia Organo', value: 'leia' },
    ];

    public render() {
        return [
            <limel-select
                label="Favorite hero"
                helperText="May the force be with him or her"
                value={this.value}
                options={this.options}
                disabled={this.disabled}
                readonly={this.readonly}
                required={this.required}
                invalid={this.invalid}
                onChange={this.changeHandler}
            />,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.disabled}
                    label="Disabled"
                    onLimelChange={this.setDisabled}
                />
                <limel-checkbox
                    checked={this.readonly}
                    label="Readonly"
                    onLimelChange={this.setReadonly}
                />
                <limel-checkbox
                    checked={this.required}
                    label="Required"
                    onLimelChange={this.setRequired}
                />
                <limel-checkbox
                    checked={this.invalid}
                    label="Invalid"
                    onLimelChange={this.setInvalid}
                />
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

    private changeHandler = (event) => {
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
