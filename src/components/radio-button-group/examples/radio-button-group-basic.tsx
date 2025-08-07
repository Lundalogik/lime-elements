import { ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Basic radio button group
 *
 * :::note
 * Individual options can also be disabled while keeping others interactive.
 * :::
 */
@Component({
    tag: 'limel-example-radio-button-group-basic',
    shadow: true,
})
export class RadioButtonBasicExample {
    @State()
    private value: any = 'option2';

    @State()
    private disabled: boolean = false;

    private options: ListItem[] = [
        { text: 'First Option', value: 'option1' },
        { text: 'Second Option', value: 'option2' },
        { text: 'Third Option', value: 'option3' },
        { text: 'Disabled Option', value: 'option4', disabled: true },
    ];

    public render() {
        return [
            <limel-radio-button-group
                options={this.options}
                value={this.value}
                disabled={this.disabled}
                onChange={this.handleChange}
            />,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.disabled}
                    label="Disabled"
                    onChange={this.setDisabled}
                />
            </limel-example-controls>,
            <limel-example-value label="Selected value" value={this.value} />,
        ];
    }

    private handleChange = (event: CustomEvent<any>) => {
        this.value = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };
}
