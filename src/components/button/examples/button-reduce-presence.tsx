import { Component, h, State } from '@stencil/core';

/**
 * Reduce Presence
 *
 * In this example, the `has-reduced-presence` class has been set.
 * This will hide the button when it is disabled. Edit the form to show the
 * button. Click the button to "save" the changes, and the button will become
 * disabled, and thus disappear.
 *
 * Read more in the [Design Guidelines](#/DesignGuidelines/decluttering.md/)
 */
@Component({
    tag: 'limel-example-button-reduce-presence',
    shadow: true,
})
export class ButtonReducePresenceExample {
    @State()
    private disabled = true;

    @State()
    private inputValue = 'Edit this field to show the Save button';

    private savedInputValue = 'Edit this field to show the Save button';

    public render() {
        return [
            <limel-input-field
                label="Some input"
                value={this.inputValue}
                onChange={this.handleInputChange}
            />,
            <br />,
            <limel-button
                class="has-reduced-presence"
                label="Save"
                primary={true}
                disabled={this.disabled}
                onClick={this.handleClick}
            />,
        ];
    }

    private handleClick = () => {
        this.savedInputValue = this.inputValue;
        this.disabled = true;
    };

    private handleInputChange = (event: CustomEvent<string>) => {
        this.inputValue = event.detail;
        this.disabled = this.inputValue === this.savedInputValue;
    };
}
