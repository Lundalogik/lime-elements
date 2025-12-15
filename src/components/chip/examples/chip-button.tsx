import { Component, State, h } from '@stencil/core';

/**
 * Chip as button
 * Typically, a chip is used to trigger an action or act as an input element.
 * This is why the component generates a `<button>` element in the DOM to give
 * a more semantically correct clues to assistive technologies.
 *
 * To trigger these actions, you will only need to handle the `onClick`
 * event on the component.
 */
@Component({
    tag: 'limel-example-chip-button',
    shadow: true,
})
export class ChipButtonExample {
    @State()
    private disabled: boolean = false;

    @State()
    private selected: boolean = false;

    @State()
    private readonly: boolean = false;

    @State()
    private invalid: boolean = false;

    public render() {
        return [
            <limel-chip
                text="FunnyCats"
                icon="hashtag"
                onClick={this.onClick}
                disabled={this.disabled}
                selected={this.selected}
                readonly={this.readonly}
                invalid={this.invalid}
            />,
            <limel-example-controls>
                <limel-switch
                    label="Disabled"
                    onChange={this.setDisabled}
                    value={this.disabled}
                />
                <limel-switch
                    label="Readonly"
                    onChange={this.setReadonly}
                    value={this.readonly}
                />
                <limel-switch
                    label="Invalid"
                    onChange={this.setInvalid}
                    value={this.invalid}
                />
                <limel-switch
                    label="Invalid"
                    onChange={this.setSelected}
                    value={this.selected}
                />
            </limel-example-controls>,
        ];
    }

    private onClick() {
        console.log('Chip is clicked.');
    }

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setSelected = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.selected = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };

    private setInvalid = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.invalid = event.detail;
    };
}
