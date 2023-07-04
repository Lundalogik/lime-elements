import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
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
        return [
            <limel-select
                label="Favorite heroes"
                value={this.value}
                options={this.options}
                disabled={this.disabled}
                readonly={this.readonly}
                required={this.required}
                onLimelChange={this.handleChange}
                multiple={true}
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
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

    private handleChange = (event: LimelSelectCustomEvent<Option[]>) => {
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
